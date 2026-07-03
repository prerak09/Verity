// Shared types for the seed modules.

export type SeededTaxonomy = {
  categories: Record<string, string>; // slug → id
  technologies: Record<string, string>; // slug → id
};
