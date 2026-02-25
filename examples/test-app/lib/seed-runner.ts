import { handleCreateNavigation, handleCreatePage } from '@structcms/api';
import { storageAdapter } from './adapters';
import { seedNavigations, seedPages } from './seed';

export interface SeedResult {
  pagesCreated: number;
  navigationsCreated: number;
  errors: string[];
}

export async function runSeed(): Promise<SeedResult> {
  const result: SeedResult = {
    pagesCreated: 0,
    navigationsCreated: 0,
    errors: [],
  };

  for (const pageInput of seedPages) {
    try {
      await handleCreatePage(storageAdapter, pageInput);
      result.pagesCreated++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push(`Failed to create page "${pageInput.title}": ${message}`);
    }
  }

  for (const navInput of seedNavigations) {
    try {
      await handleCreateNavigation(storageAdapter, navInput);
      result.navigationsCreated++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push(`Failed to create navigation "${navInput.name}": ${message}`);
    }
  }

  return result;
}
