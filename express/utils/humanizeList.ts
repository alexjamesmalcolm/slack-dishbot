export const humanizeList = (list: string[]): string => {
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return "a, b, and c";
};
