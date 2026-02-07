import type { InferSectionData } from '@structcms/core';
import type { HeroSection as HeroSectionDef, ContentSection as ContentSectionDef } from '@/lib/registry';
import { HeroSection } from './hero';
import { ContentSection } from './content';

export type HeroData = InferSectionData<typeof HeroSectionDef>;
export type ContentData = InferSectionData<typeof ContentSectionDef>;

type SectionDataMap = {
  hero: HeroData;
  content: ContentData;
};

export type SectionType = keyof SectionDataMap;

export interface SectionComponentProps<T extends SectionType> {
  data: SectionDataMap[T];
}

export const sectionComponents: {
  [K in SectionType]: React.ComponentType<SectionComponentProps<K>>;
} = {
  hero: HeroSection,
  content: ContentSection,
};

export function isSectionType(type: string): type is SectionType {
  return type in sectionComponents;
}

export function getComponent(
  type: SectionType
): React.ComponentType<{ data: Record<string, unknown> }> {
  return sectionComponents[type] as React.ComponentType<{
    data: Record<string, unknown>;
  }>;
}
