import type { CreateSectionRendererConfig, SectionData, SectionRenderer } from './types';

/**
 * Creates a section renderer that maps section types to components.
 * Framework-agnostic: works with React, Preact, Vue, or plain functions.
 *
 * @example
 * // With React
 * const renderSection = createSectionRenderer({
 *   components: {
 *     hero: HeroComponent,
 *     text: TextComponent,
 *   },
 * });
 *
 * // In page component
 * export function Page({ sections }) {
 *   return sections.map((section, i) => renderSection(section, i));
 * }
 *
 * @example
 * // With fallback for unknown sections
 * const renderSection = createSectionRenderer({
 *   components: { hero: HeroComponent },
 *   fallback: ({ data, sectionKey }) => <div key={sectionKey}>Unknown section</div>,
 * });
 */
export function createSectionRenderer<R = unknown>(
  config: CreateSectionRendererConfig<R>
): SectionRenderer<R> {
  const { components, fallback } = config;

  return (section: SectionData, key: string | number): R | null => {
    const component = components[section.type];

    if (component) {
      return component({ data: section.data, sectionKey: key });
    }

    if (fallback) {
      return fallback({ data: section.data, sectionKey: key });
    }

    return null;
  };
}
