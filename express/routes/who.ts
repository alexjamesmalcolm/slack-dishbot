import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";
import { respond } from "../respond";
import { duration } from "moment";

export const who: RequestHandler = async (req, res) => {
  const { response_url, channel_id, channel_name } = req.body as SlashMessage;
  res.send();
  const respondWithMessage = respond(response_url);
  const [mongo, close] = await connect();
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (!dishwheel) {
    respondWithMessage(`No dishwheel in channel ${channel_name}.`);
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
      respondWithMessage(
        `${dishwheel.currentDishwasher}'s turn on dishes started ${duration(
          -1 * millisecondsOnDishes
        ).humanize(true)} and has so far accrued a fine of $${
          Math.floor(countOfFinePeriodsPassed) * dishwheel.fineAmount
        } and will accrue $${dishwheel.fineAmount} more ${duration(
          (countOfFinePeriodsPassed % 1) * dishwheel.fineAmount
        ).humanize(true)}`
      );
    } else if (isItPossibleForThereToBeAFine) {
      respondWithMessage(
        `${dishwheel.currentDishwasher}'s turn on dishes started ${duration(
          -1 * millisecondsOnDishes
        ).humanize(true)} and ${duration(millisecondsTillFine).humanize(
          true
        )} will receive a fine of ${dishwheel.fineAmount}`
      );
    } else {
      respondWithMessage(
        `${dishwheel.currentDishwasher}'s  turn on dishes started ${duration(
          -1 * millisecondsOnDishes
        ).humanize(true)}`
      );
    }
  }
  close();
};
