import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";

export const initialFineDuration: RequestHandler = async (req, res) => {
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
    res.send(
      `The initial fine duration in seconds is ${dishwheel.secondsUntilFine}.`
    );
  } else if (user_id !== dishwheel.creatorId) {
    res.send(
      `${user_name} cannot change the dishwheel's inital fine duration, only the creator of the dishwheel can.`
    );
  } else {
    const secondsUntilFine = Number.parseFloat(text.trim());
    if (!Number.isNaN(secondsUntilFine) && secondsUntilFine >= 0) {
      const alteredDishwheel: Dishwheel = {
        ...dishwheel,
        secondsUntilFine,
      };
      await collectionOfDishwheels.updateOne(
        { channel_id },
        {
          $set: alteredDishwheel,
        }
      );
      res.send(
        `Updated inital fine duration to ${dishwheel.secondsUntilFine} seconds.`
      );
    } else {
      res.send(
        `Could not set "${text}" as the inital fine duration in seconds.`
      );
    }
  }
  close();
};
