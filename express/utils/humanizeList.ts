export const humanizeList = (list: string[]): string =>
  list.reduce((previousValue, value, index) => {
    const isLast = index === list.length - 1;
    if (isLast) {
      const isOxfordCommaNeeded = list.length >= 3;
      return `${previousValue}${isOxfordCommaNeeded ? "," : ""} and ${value}`;
    }
    return `${previousValue}, ${value}`;
  });
