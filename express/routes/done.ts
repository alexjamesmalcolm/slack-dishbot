import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel, { getNextDishwasher } from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";

export const done: RequestHandler = async (req, res) => {
  const {
    channel_id,
    user_name: person,
    channel_name,
  } = req.body as SlashMessage;
  const [mongo, close] = await connect();
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (!dishwheel) {
    res.send(`No dishwheel in channel ${channel_name}.`);
  } else if (!dishwheel.dishwashers.includes(person)) {
    res.send(`${person} is not a member of this channel's dishwheel.`);
  } else if (dishwheel.currentDishwasher !== person) {
    res.send(`${person} is not on dishes.`);
  } else {
    const alteredDishwheel: Dishwheel = {
      ...dishwheel,
      dateCurrentDishwasherStarted: new Date().toISOString(),
      currentDishwasher: getNextDishwasher(dishwheel),
    };
    await collectionOfDishwheels.updateOne(
      { channel_id },
      {
        $set: alteredDishwheel,
      }
    );
    const isItPossibleForThereToBeAFine =
      dishwheel.fineAmount > 0 && dishwheel.secondsUntilFine > 0;
    const millisecondsOnDishes =
      new Date().getTime() -
      new Date(dishwheel.dateCurrentDishwasherStarted).getTime();
    const countOfFinePeriodsPassed =
      dishwheel.finePeriodicity > 0
        ? 1 +
          (millisecondsOnDishes - dishwheel.secondsUntilFine * 1000) /
            (dishwheel.finePeriodicity * 1000)
        : millisecondsOnDishes / (dishwheel.secondsUntilFine * 1000);
    const accruedFine =
      Math.floor(countOfFinePeriodsPassed) * dishwheel.fineAmount;
    const hasFine = isItPossibleForThereToBeAFine && accruedFine > 0;
    if (hasFine) {
      res.send(
        `${person} completed the dishes with a fine of $${accruedFine}, ${alteredDishwheel.currentDishwasher} is now up.`
      );
    } else {
      res.send(
        `${person} completed the dishes, ${alteredDishwheel.currentDishwasher} is now up.`
      );
    }
  }
  close();
};
