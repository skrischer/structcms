import {
  handleListPages,
  handleGetPageBySlug,
} from '../delivery';
import {
  handleCreatePage,
  handleUpdatePage,
  handleDeletePage,
  handleCreateNavigation,
  handleUpdateNavigation,
  handleDeleteNavigation,
  StorageValidationError,
} from '../storage';
import {
  handleListMedia,
  handleUploadMedia,
  handleGetMedia,
  handleDeleteMedia,
  MediaValidationError,
} from '../media';
import type {
  StorageAdapter,
  CreatePageInput,
  UpdatePageInput,
  CreateNavigationInput,
  UpdateNavigationInput,
  Page,
  Navigation,
  PageSection,
  NavigationItem,
} from '../storage';
import type { MediaAdapter, UploadMediaInput } from '../media';

type JsonRecord = Record<string, unknown>;
type ParsedPageSection = {
  id?: string;
  type: string;
  data: JsonRecord;
};

type ParsedUpdatePagePatch = {
  slug?: string;
  pageType?: string;
  title?: string;
  sections?: ParsedPageSection[];
};

interface RequestLike {
  json(): Promise<unknown>;
  formData(): Promise<FormDataLike>;
}

interface FormDataLike {
  get(name: string): unknown;
}

interface FileLike {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface ResponseLike {
  status: number;
  json(): Promise<unknown>;
}

interface ResponseConstructorLike {
  new (body?: string, init?: { status?: number; headers?: Record<string, string> }): ResponseLike;
}

interface RouteContext<TParams extends Record<string, string | string[]>> {
  params: TParams | Promise<TParams>;
}

export interface NextPagesRouteConfig {
  storageAdapter: StorageAdapter;
}

export interface NextPageBySlugRouteConfig {
  storageAdapter: StorageAdapter;
}

export interface NextPageByIdRouteConfig {
  storageAdapter: StorageAdapter;
}

export interface NextMediaRouteConfig {
  mediaAdapter: MediaAdapter;
}

export interface NextMediaByIdRouteConfig {
  mediaAdapter: MediaAdapter;
}

export interface NextNavigationRouteConfig {
  storageAdapter: StorageAdapter;
}

export interface NextNavigationByIdRouteConfig {
  storageAdapter: StorageAdapter;
}

function getResponseConstructor(): ResponseConstructorLike {
  const responseCtor = (globalThis as typeof globalThis & { Response?: ResponseConstructorLike }).Response;

  if (!responseCtor) {
    throw new Error('Response constructor is not available in this runtime');
  }

  return responseCtor;
}

function jsonResponse(data: unknown, status = 200): ResponseLike {
  const ResponseCtor = getResponseConstructor();

  return new ResponseCtor(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

function errorResponse(error: unknown, fallbackStatus = 500): ResponseLike {
  if (
    error instanceof StorageValidationError ||
    error instanceof MediaValidationError ||
    error instanceof SyntaxError
  ) {
    return jsonResponse({ error: getErrorMessage(error) }, 400);
  }

  return jsonResponse({ error: getErrorMessage(error) }, fallbackStatus);
}

async function resolveParams<TParams extends Record<string, string | string[]>>(
  context: RouteContext<TParams>
): Promise<TParams> {
  return context.params;
}

function normalizeSlug(slug: string | string[]): string {
  return Array.isArray(slug) ? slug.join('/') : slug;
}

function asObject(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function isFileLike(value: unknown): value is FileLike {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as {
    name?: unknown;
    type?: unknown;
    size?: unknown;
    arrayBuffer?: unknown;
  };

  return (
    typeof candidate.name === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.size === 'number' &&
    typeof candidate.arrayBuffer === 'function'
  );
}

function parseStringField(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parsePageSections(value: unknown): ParsedPageSection[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    return undefined;
  }

  const sections: ParsedPageSection[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return undefined;
    }

    const sectionCandidate = entry as {
      id?: unknown;
      type?: unknown;
      data?: unknown;
    };

    if (
      (sectionCandidate.id !== undefined && typeof sectionCandidate.id !== 'string') ||
      typeof sectionCandidate.type !== 'string' ||
      !sectionCandidate.data ||
      typeof sectionCandidate.data !== 'object' ||
      Array.isArray(sectionCandidate.data)
    ) {
      return undefined;
    }

    sections.push({
      id: sectionCandidate.id,
      type: sectionCandidate.type,
      data: sectionCandidate.data as JsonRecord,
    });
  }

  return sections;
}

function normalizePageSections(
  sections: ParsedPageSection[] | undefined,
  existingSections: PageSection[] = []
): PageSection[] | undefined {
  if (!sections) {
    return undefined;
  }

  return sections.map((section, index) => ({
    id: section.id ?? existingSections[index]?.id ?? `${section.type}-${index + 1}`,
    type: section.type,
    data: section.data,
  }));
}

function parseNavigationItems(value: unknown): NavigationItem[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items: NavigationItem[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return undefined;
    }

    const itemCandidate = entry as {
      label?: unknown;
      href?: unknown;
      children?: unknown;
    };

    if (
      typeof itemCandidate.label !== 'string' ||
      typeof itemCandidate.href !== 'string'
    ) {
      return undefined;
    }

    const children =
      itemCandidate.children === undefined
        ? undefined
        : parseNavigationItems(itemCandidate.children);

    if (itemCandidate.children !== undefined && !children) {
      return undefined;
    }

    items.push({
      label: itemCandidate.label,
      href: itemCandidate.href,
      children,
    });
  }

  return items;
}

function parseCreatePageInput(payload: JsonRecord): CreatePageInput | null {
  const pageType = parseStringField(payload.pageType);
  const title = parseStringField(payload.title);
  const slug = parseStringField(payload.slug);
  const sections = normalizePageSections(parsePageSections(payload.sections));

  if (!pageType || !title) {
    return null;
  }

  if (payload.sections !== undefined && !sections) {
    return null;
  }

  return {
    pageType,
    title,
    slug,
    sections,
  };
}

function parseUpdatePagePatch(payload: JsonRecord): ParsedUpdatePagePatch | null {
  const slug = parseStringField(payload.slug);
  const pageType = parseStringField(payload.pageType);
  const title = parseStringField(payload.title);
  const sections = parsePageSections(payload.sections);

  if (payload.slug !== undefined && !slug) {
    return null;
  }
  if (payload.pageType !== undefined && !pageType) {
    return null;
  }
  if (payload.title !== undefined && !title) {
    return null;
  }
  if (payload.sections !== undefined && !sections) {
    return null;
  }

  return {
    slug,
    pageType,
    title,
    sections,
  };
}

function parseCreateNavigationInput(
  payload: JsonRecord
): CreateNavigationInput | null {
  const name = parseStringField(payload.name);
  const items = parseNavigationItems(payload.items);

  if (!name || !items) {
    return null;
  }

  return {
    name,
    items,
  };
}

function parseUpdateNavigationPatch(
  payload: JsonRecord
): Omit<UpdateNavigationInput, 'id'> | null {
  const name = parseStringField(payload.name);
  const items =
    payload.items === undefined ? undefined : parseNavigationItems(payload.items);

  if (payload.name !== undefined && !name) {
    return null;
  }
  if (payload.items !== undefined && !items) {
    return null;
  }

  return {
    name,
    items,
  };
}

function toPageResponse(page: Page): Record<string, unknown> {
  return {
    id: page.id,
    slug: page.slug,
    pageType: page.pageType,
    title: page.title,
    sections: page.sections,
    meta: {
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    },
  };
}

function toNavigationResponse(navigation: Navigation): Record<string, unknown> {
  return {
    id: navigation.id,
    name: navigation.name,
    items: navigation.items,
    meta: {
      updatedAt: navigation.updatedAt.toISOString(),
    },
  };
}

export function createNextPagesRoute(config: NextPagesRouteConfig) {
  return {
    GET: async (_request: RequestLike): Promise<ResponseLike> => {
      try {
        const pages = await handleListPages(config.storageAdapter);
        return jsonResponse(pages);
      } catch (error) {
        return errorResponse(error);
      }
    },
    POST: async (request: RequestLike): Promise<ResponseLike> => {
      try {
        const payload = asObject(await request.json());
        if (!payload) {
          return jsonResponse({ error: 'Request body must be an object' }, 400);
        }

        const createInput = parseCreatePageInput(payload);
        if (!createInput) {
          return jsonResponse({ error: 'Invalid page payload' }, 400);
        }

        const page = await handleCreatePage(config.storageAdapter, createInput);
        return jsonResponse(page, 201);
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
  };
}

export function createNextPageBySlugRoute(config: NextPageBySlugRouteConfig) {
  return {
    GET: async (
      _request: RequestLike,
      context: RouteContext<{ slug: string | string[] }>
    ): Promise<ResponseLike> => {
      try {
        const { slug } = await resolveParams(context);
        const page = await handleGetPageBySlug(config.storageAdapter, normalizeSlug(slug));

        if (!page) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        return jsonResponse(page);
      } catch (error) {
        return errorResponse(error);
      }
    },
    PUT: async (
      request: RequestLike,
      context: RouteContext<{ slug: string | string[] }>
    ): Promise<ResponseLike> => {
      try {
        const { slug } = await resolveParams(context);
        const normalizedSlug = normalizeSlug(slug);
        const existingPage = await handleGetPageBySlug(
          config.storageAdapter,
          normalizedSlug
        );

        if (!existingPage) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        const payload = asObject(await request.json());
        if (!payload) {
          return jsonResponse({ error: 'Request body must be an object' }, 400);
        }

        const pagePatch = parseUpdatePagePatch(payload);
        if (!pagePatch) {
          return jsonResponse({ error: 'Invalid page payload' }, 400);
        }

        const normalizedSections = normalizePageSections(
          pagePatch.sections,
          existingPage.sections
        );

        const page = await handleUpdatePage(config.storageAdapter, {
          ...pagePatch,
          sections: normalizedSections,
          id: existingPage.id,
        });

        return jsonResponse(toPageResponse(page));
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
    DELETE: async (
      _request: RequestLike,
      context: RouteContext<{ slug: string | string[] }>
    ): Promise<ResponseLike> => {
      try {
        const { slug } = await resolveParams(context);
        const existingPage = await handleGetPageBySlug(
          config.storageAdapter,
          normalizeSlug(slug)
        );

        if (!existingPage) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        await handleDeletePage(config.storageAdapter, existingPage.id);
        return jsonResponse({ success: true });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

export function createNextPageByIdRoute(config: NextPageByIdRouteConfig) {
  return {
    GET: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const page = await config.storageAdapter.getPageById(id);

        if (!page) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        return jsonResponse(toPageResponse(page));
      } catch (error) {
        return errorResponse(error);
      }
    },
    PUT: async (
      request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const existingPage = await config.storageAdapter.getPageById(id);

        if (!existingPage) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        const payload = asObject(await request.json());
        if (!payload) {
          return jsonResponse({ error: 'Request body must be an object' }, 400);
        }

        const pagePatch = parseUpdatePagePatch(payload);
        if (!pagePatch) {
          return jsonResponse({ error: 'Invalid page payload' }, 400);
        }

        const normalizedSections = normalizePageSections(
          pagePatch.sections,
          existingPage.sections
        );

        const page = await handleUpdatePage(config.storageAdapter, {
          ...pagePatch,
          sections: normalizedSections,
          id: existingPage.id,
        });

        return jsonResponse(toPageResponse(page));
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
    DELETE: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const existingPage = await config.storageAdapter.getPageById(id);

        if (!existingPage) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }

        await handleDeletePage(config.storageAdapter, existingPage.id);
        return jsonResponse({ success: true });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

export function createNextMediaRoute(config: NextMediaRouteConfig) {
  return {
    GET: async (_request: RequestLike): Promise<ResponseLike> => {
      try {
        const media = await handleListMedia(config.mediaAdapter);
        return jsonResponse(media);
      } catch (error) {
        return errorResponse(error);
      }
    },
    POST: async (request: RequestLike): Promise<ResponseLike> => {
      try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!isFileLike(file)) {
          return jsonResponse({ error: 'No file provided' }, 400);
        }

        const input: UploadMediaInput = {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          data: await file.arrayBuffer(),
        };

        const mediaFile = await handleUploadMedia(config.mediaAdapter, input);
        return jsonResponse(mediaFile, 201);
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
  };
}

export function createNextMediaByIdRoute(config: NextMediaByIdRouteConfig) {
  return {
    GET: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const media = await handleGetMedia(config.mediaAdapter, id);

        if (!media) {
          return jsonResponse({ error: 'Media not found' }, 404);
        }

        return jsonResponse(media);
      } catch (error) {
        return errorResponse(error);
      }
    },
    DELETE: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        await handleDeleteMedia(config.mediaAdapter, id);
        return jsonResponse({ success: true });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

export function createNextNavigationRoute(config: NextNavigationRouteConfig) {
  return {
    GET: async (_request: RequestLike): Promise<ResponseLike> => {
      try {
        const navigations = await config.storageAdapter.listNavigations();
        return jsonResponse(navigations.map(toNavigationResponse));
      } catch (error) {
        return errorResponse(error);
      }
    },
    POST: async (request: RequestLike): Promise<ResponseLike> => {
      try {
        const payload = asObject(await request.json());
        if (!payload) {
          return jsonResponse({ error: 'Request body must be an object' }, 400);
        }

        const createInput = parseCreateNavigationInput(payload);
        if (!createInput) {
          return jsonResponse({ error: 'Invalid navigation payload' }, 400);
        }

        const navigation = await handleCreateNavigation(config.storageAdapter, createInput);

        return jsonResponse(navigation, 201);
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
  };
}

export function createNextNavigationByIdRoute(
  config: NextNavigationByIdRouteConfig
) {
  return {
    GET: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const navigation = await config.storageAdapter.getNavigationById(id);

        if (!navigation) {
          return jsonResponse({ error: 'Navigation not found' }, 404);
        }

        return jsonResponse(toNavigationResponse(navigation));
      } catch (error) {
        return errorResponse(error);
      }
    },
    PUT: async (
      request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const existingNavigation = await config.storageAdapter.getNavigationById(id);

        if (!existingNavigation) {
          return jsonResponse({ error: 'Navigation not found' }, 404);
        }

        const payload = asObject(await request.json());
        if (!payload) {
          return jsonResponse({ error: 'Request body must be an object' }, 400);
        }

        const navigationPatch = parseUpdateNavigationPatch(payload);
        if (!navigationPatch) {
          return jsonResponse({ error: 'Invalid navigation payload' }, 400);
        }

        const navigation = await handleUpdateNavigation(config.storageAdapter, {
          ...navigationPatch,
          id: existingNavigation.id,
        });

        return jsonResponse(navigation);
      } catch (error) {
        return errorResponse(error, 400);
      }
    },
    DELETE: async (
      _request: RequestLike,
      context: RouteContext<{ id: string }>
    ): Promise<ResponseLike> => {
      try {
        const { id } = await resolveParams(context);
        const existingNavigation = await config.storageAdapter.getNavigationById(id);

        if (!existingNavigation) {
          return jsonResponse({ error: 'Navigation not found' }, 404);
        }

        await handleDeleteNavigation(config.storageAdapter, existingNavigation.id);
        return jsonResponse({ success: true });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}
