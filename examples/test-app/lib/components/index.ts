import type {
  ContentSection as ContentSectionDef,
  CtaSection as CtaSectionDef,
  HeroSection as HeroSectionDef,
  ShowcaseSection as ShowcaseSectionDef,
} from '@/lib/registry';
import type { InferSectionData } from '@structcms/core';
import { ContentSection } from './content';
import { CtaSection } from './cta';
import { HeroSection } from './hero';
import { ShowcaseSection } from './showcase';

export type HeroData = InferSectionData<typeof HeroSectionDef>;
export type ContentData = InferSectionData<typeof ContentSectionDef>;
export type CtaData = InferSectionData<typeof CtaSectionDef>;
export type ShowcaseData = InferSectionData<typeof ShowcaseSectionDef>;

type SectionDataMap = {
  hero: HeroData;
  content: ContentData;
  cta: CtaData;
  showcase: ShowcaseData;
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
  cta: CtaSection,
  showcase: ShowcaseSection,
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
