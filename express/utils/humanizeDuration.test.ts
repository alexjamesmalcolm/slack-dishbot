import { Temporal } from "@js-temporal/polyfill";
import { humanizeDuration } from "./humanizeDuration";

describe("humanizeDuration", () => {
  it("should display 5 hours and 60 minutes as 6 hours", () => {
    const duration = Temporal.Duration.from({ hours: 5, minutes: 60 });
    const result = humanizeDuration(duration, true);
    expect(result).toBe("in 6 hours");
  });
  it("should display 5 hours and 61 minutes as 6 hours and 1 minute", () => {
    const duration = Temporal.Duration.from({ hours: 5, minutes: 61 });
    const result = humanizeDuration(duration, true);
    expect(result).toBe("in 6 hours and 1 minute");
  });
  it("should display 5 hours and 62 minutes as 6 hours and 2 minutes", () => {
    const duration = Temporal.Duration.from({ hours: 5, minutes: 62 });
    const result = humanizeDuration(duration, true);
    expect(result).toBe("in 6 hours and 2 minutes");
  });
  it("should display 5 hours, 62 minutes, and 5 seconds as 6 hours and 2 minutes", () => {
    const duration = Temporal.Duration.from({
      hours: 5,
      minutes: 62,
      seconds: 5,
    });
    const result = humanizeDuration(duration, true);
    expect(result).toBe("in 6 hours and 2 minutes");
  });
  it("should display 5 hours, 62 minutes, and 5 seconds as 6 hours", () => {
    const duration = Temporal.Duration.from({
      hours: 5,
      minutes: 62,
      seconds: 5,
    });

    const result = humanizeDuration(duration, true, 1);

    expect(result).toBe("in 6 hours");
  });
});
