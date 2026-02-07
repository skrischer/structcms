import type { InferSectionData } from '@structcms/core';
import type { HeroSection, ContentSection } from '@/lib/registry';

export type HeroData = InferSectionData<typeof HeroSection>;
export type ContentData = InferSectionData<typeof ContentSection>;

type SectionDataMap = {
  hero: HeroData;
  content: ContentData;
};

export type SectionType = keyof SectionDataMap;

export interface SectionComponentProps<T extends SectionType> {
  data: SectionDataMap[T];
}

export function isSectionType(type: string): type is SectionType {
  return type === 'hero' || type === 'content';
}
