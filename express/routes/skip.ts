import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel, { getNextDishwasher } from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";
import { respond } from "../respond";
import { noDishwheelFoundResponse } from "./responses/no-dishwheel-found";

export const skip: RequestHandler = async (req, res) => {
  const message = req.body as SlashMessage;
  const {
    channel_id,
    channel_name,
    user_id,
    user_name,
    response_url,
  } = message;
  res.send();
  const [mongo, close] = await connect();
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (!dishwheel) {
    noDishwheelFoundResponse(message);
  } else if (dishwheel.creatorId !== user_id) {
    respond(
      response_url,
      `${user_name} cannot skip the current dishwasher, only the creator of the dishwheel can.`
    );
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
    respond(response_url, `${dishwheel.currentDishwasher} has been skipped.`);
  }
  close();
};
