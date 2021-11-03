import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";
import { noDishwheelFoundResponse } from "./responses/no-dishwheel-found";
import { respond } from "../respond";
import { getDurationOfNextFine } from "../utils/time";
import { formatMoney } from "../utils/formatMoney";
import { formatUsername } from "../utils/formatUsername";
import { humanizeDuration } from "../utils/humanizeDuration";
import { Temporal } from "@js-temporal/polyfill";

export const who: RequestHandler = async (req, res) => {
  const message = req.body as SlashMessage;
  const { channel_id, response_url } = message;
  res.send();
  const [mongo, close] = await connect();
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (!dishwheel) {
    noDishwheelFoundResponse(message);
  } else {
    const millisecondsOnDishes =
      new Date().getTime() -
      new Date(dishwheel.dateCurrentDishwasherStarted).getTime();
    const millisecondsTillFine =
      dishwheel.secondsUntilFine * 1000 - millisecondsOnDishes;
    const isItPossibleForThereToBeAFine =
      dishwheel.fineAmount > 0 && dishwheel.secondsUntilFine > 0;
    const countOfFinePeriodsPassed =
      dishwheel.finePeriodicity > 0
        ? 1 +
          (millisecondsOnDishes - dishwheel.secondsUntilFine * 1000) /
            (dishwheel.finePeriodicity * 1000)
        : millisecondsOnDishes / (dishwheel.secondsUntilFine * 1000);
    if (isItPossibleForThereToBeAFine && countOfFinePeriodsPassed >= 1) {
      const durationOfNextFine = getDurationOfNextFine(dishwheel);
      respond(
        response_url,
        `${formatUsername(
          dishwheel.currentDishwasher
        )}'s turn on dishes started ${humanizeDuration(
          Temporal.Duration.from({ milliseconds: -1 * millisecondsOnDishes }),
          true
        )} and has so far accrued a fine of ${formatMoney(
          Math.floor(countOfFinePeriodsPassed) * dishwheel.fineAmount
        )} and will accrue ${formatMoney(
          dishwheel.fineAmount
        )} more ${humanizeDuration(durationOfNextFine, true)}`,
        true
      );
    } else if (isItPossibleForThereToBeAFine) {
      respond(
        response_url,
        `${formatUsername(
          dishwheel.currentDishwasher
        )}'s turn on dishes started ${humanizeDuration(
          Temporal.Duration.from({ milliseconds: -1 * millisecondsOnDishes }),
          true
        )} and ${humanizeDuration(
          Temporal.Duration.from({ milliseconds: millisecondsTillFine }),
          true
        )} will receive a fine of ${formatMoney(dishwheel.fineAmount)}`,
        true
      );
    } else {
      respond(
        response_url,
        `${formatUsername(
          dishwheel.currentDishwasher
        )}'s turn on dishes started ${humanizeDuration(
          Temporal.Duration.from({ milliseconds: -1 * millisecondsOnDishes }),
          true
        )}`,
        true
      );
    }
  }
  close();
};
