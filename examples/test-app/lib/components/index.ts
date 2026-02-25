import type {
  ContentSection as ContentSectionDef,
  HeroSection as HeroSectionDef,
} from '@/lib/registry';
import type { InferSectionData } from '@structcms/core';
import { ContentSection } from './content';
import { HeroSection } from './hero';

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
