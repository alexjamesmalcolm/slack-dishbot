export const humanizeList = (list: string[]): string => {
  if (list.length === 0) return "";
  return list.reduce((previousValue, value, index) => {
    const isLast = index === list.length - 1;
    if (isLast) {
      const isOxfordCommaNeeded = list.length >= 3;
      return `${previousValue}${isOxfordCommaNeeded ? "," : ""} and ${value}`;
    }
    return `${previousValue}, ${value}`;
  });
};
