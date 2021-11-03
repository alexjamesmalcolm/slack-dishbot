import { Temporal } from "@js-temporal/polyfill";
import { humanizeList } from "./humanizeList";

interface Unit {
  singular: Temporal.DurationTotalOptions["unit"];
  plural: Temporal.DurationTotalOptions["unit"];
}

export const humanizeDuration = (
  duration: Temporal.Duration,
  relative: boolean = false,
  numberOfComponents: number = 2
): string => {
  const units: Unit[] = [
    { plural: "days", singular: "day" },
    { plural: "hours", singular: "hour" },
    { plural: "minutes", singular: "minute" },
    { plural: "seconds", singular: "second" },
  ];

  const significantUnits: { amount: number; unit: Unit }[] = units.reduce(
    (accumulator: { amount: number; unit: Unit }[], unit) => {
      const durationWithoutPreviousTotals = accumulator.reduce(
        (duration, { amount, unit }) =>
          duration.subtract(Temporal.Duration.from({ [unit.plural]: amount })),
        duration
      );
      const unitTotal = Math.floor(
        durationWithoutPreviousTotals.total({ unit: unit.singular })
      );
      if (unitTotal >= 1) {
        return [
          ...accumulator,
          {
            amount: unitTotal,
            unit,
          },
        ];
      }
      return accumulator;
    },
    []
  );

  const result = humanizeList(
    significantUnits
      .filter((_value, index) => index < numberOfComponents)
      .map(({ amount, unit }) => {
        const isPlural = amount > 1;
        if (isPlural) return `${amount} ${unit.plural}`;
        return `${amount} ${unit.singular}`;
      })
  );

  if (result && relative) {
    if (duration.sign > 0) {
      return `in ${result}`;
    } else {
      return `${result} ago`;
    }
  }
  return result;
};
