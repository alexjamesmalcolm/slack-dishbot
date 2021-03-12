import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";
import { duration } from "moment";

export const repeatingFineDuration: RequestHandler = async (req, res) => {
  const {
    channel_id,
    channel_name,
    text,
    user_id,
    user_name,
  } = req.body as SlashMessage;
  const [mongo, close] = await connect();
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (!dishwheel) {
    res.send(`No dishwheel in channel ${channel_name}.`);
  } else if (text.trim() === "") {
    res.send(`The repeating fine duration is ${dishwheel.finePeriodicity}.`);
  } else if (user_id !== dishwheel.creatorId) {
    res.send(
      `${user_name} cannot change the dishwheel's repeating fine duration, only the creator of the dishwheel can.`
    );
  } else {
    const finePeriodicity = Number.parseFloat(text.trim());
    if (!Number.isNaN(finePeriodicity) && finePeriodicity >= 0) {
      const alteredDishwheel: Dishwheel = {
        ...dishwheel,
        finePeriodicity,
      };
      await collectionOfDishwheels.updateOne(
        { channel_id },
        {
          $set: alteredDishwheel,
        }
      );
      res.send(
        `Updated repeating fine duration to ${duration(
          dishwheel.finePeriodicity
        ).humanize()}.`
      );
    } else {
      res.send(`Could not set "${text}" as the repeating fine duration.`);
    }
  }
  close();
};
