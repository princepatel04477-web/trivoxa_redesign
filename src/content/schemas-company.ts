/**
 * Kept separate from schemas.ts so company.ts never pulls the zod runtime
 * into client bundles that only need a sentence.
 */
export type ShiveshwarRelationship = 'parent-company' | 'strategic-partner';
