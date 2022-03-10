import { Temporal } from "@js-temporal/polyfill";
import { humanizeList } from "./humanizeList";

type UnitPart =
  | "days"
  | "day"
  | "hours"
  | "hour"
  | "minutes"
  | "minute"
  | "seconds"
  | "second";

interface Unit {
  singular: UnitPart;
  plural: UnitPart;
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

  const absoluteDuration = duration.abs();

  const significantUnits: { amount: number; unit: Unit }[] = units.reduce(
    (accumulator: { amount: number; unit: Unit }[], unit) => {
      const durationWithoutPreviousTotals = accumulator.reduce(
        (duration, { amount, unit }) =>
          duration.subtract(Temporal.Duration.from({ [unit.plural]: amount })),
        absoluteDuration
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

  const convertedToStringComponents = significantUnits.map(
    ({ amount, unit }) => {
      const isPlural = amount > 1;
      if (isPlural) return `${amount} ${unit.plural}`;
      return `${amount} ${unit.singular}`;
    }
  );

  const onlyComponentsWithinLimit = convertedToStringComponents.filter(
    (_value, index) => {
      return index < numberOfComponents;
    }
  );

  const humanizedResult = humanizeList(onlyComponentsWithinLimit);

  if (humanizedResult && relative) {
    if (duration.sign > 0) {
      return `in ${humanizedResult}`;
    } else {
      return `${humanizedResult} ago`;
    }
  }
  return humanizedResult;
};
