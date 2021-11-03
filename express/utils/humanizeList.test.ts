import { humanizeList } from "./humanizeList";

describe("humanizeList", () => {
  it("should produce an oxford comma'd list of 3", () => {
    const list = ["a", "b", "c"];

    const result = humanizeList(list);

    expect(result).toBe("a, b, and c");
  });

  it("should produce a list of 2 conjoined only by an 'and'", () => {
    const list = ["a", "b"];

    const result = humanizeList(list);

    expect(result).toBe("a and b");
  });

  it("should produce a list of 1 that's just the single item", () => {
    const list = ["a"];

    const result = humanizeList(list);

    expect(result).toBe("a");
  });

  it("should produce an oxford comma'd list of 3 but reversed", () => {
    const list = ["c", "b", "a"];

    const result = humanizeList(list);

    expect(result).toBe("c, b, and a");
  });
});
