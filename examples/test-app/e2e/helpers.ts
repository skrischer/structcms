export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function resetOnly(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/cms/testing/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Reset failed: ${response.statusText}`);
  }
}

export async function seedOnly(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/cms/testing/seed`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Seed failed: ${response.statusText}`);
  }
}

export async function resetAndSeed(): Promise<void> {
  await resetOnly();
  await seedOnly();
}
