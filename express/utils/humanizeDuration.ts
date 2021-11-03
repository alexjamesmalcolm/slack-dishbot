import { Temporal } from "@js-temporal/polyfill";

export const humanizeDuration = (
  duration: Temporal.Duration,
  relative: boolean = false
): string => {
  let result = "";
  const units: {
    singular: Temporal.DurationTotalOptions["unit"];
    plural: Temporal.DurationTotalOptions["unit"];
  }[] = [
    { plural: "days", singular: "day" },
    { plural: "hours", singular: "hour" },
    { plural: "minutes", singular: "minute" },
    { plural: "seconds", singular: "second" },
  ];

  const bigUnit = units.find(
    (unit) => duration.total({ unit: unit.plural }) >= 1
  );

  if (bigUnit) {
    const bigUnitTotal = Math.floor(duration.total({ unit: bigUnit.singular }));
    result += `${bigUnitTotal} ${
      bigUnitTotal > 1 ? bigUnit.plural : bigUnit.singular
    }`;

    const durationWithoutBigUnitTotal = duration.subtract(
      Temporal.Duration.from({
        [bigUnit.plural]: bigUnitTotal,
      })
    );
    const smallUnit = units.find(
      (unit) => durationWithoutBigUnitTotal.total({ unit: unit.plural }) >= 1
    );

    if (smallUnit) {
      const smallUnitTotal = Math.floor(
        durationWithoutBigUnitTotal.total({
          unit: smallUnit.singular,
        })
      );
      result += ` and ${smallUnitTotal} ${
        smallUnitTotal > 1 ? smallUnit.plural : smallUnit.singular
      }`;
    }
  }

  if (result) {
    if (!relative) return result;
    if (duration.sign > 0) {
      result = `in ${result}`;
    } else {
      result = `${result} ago`;
    }
  }

  return result;
};
