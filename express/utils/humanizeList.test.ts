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
});
