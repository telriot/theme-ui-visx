export const camelToTitleCase = (text: string) => {
  const res = text.replace(/([A-Z])/g, ' $1');
  return `${res.charAt(0).toUpperCase()}${res.slice(1)}`.trim();
};
