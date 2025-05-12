// Utility function to normalize text for comparison
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // Remove punctuation
    .trim();
};
