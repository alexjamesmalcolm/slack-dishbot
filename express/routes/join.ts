import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";
import { respond } from "../respond";

export const join: RequestHandler = async (req, res) => {
  res.send();
  const [mongo, close] = await connect();
  const {
    response_url: responseUrl,
    channel_id,
    user_id,
    user_name: person,
  } = req.body as SlashMessage;
  const respondWithMessage = respond(responseUrl);
  const collectionOfDishwheels = mongo.collection<Dishwheel>("dishwheels");
  const dishwheel = await collectionOfDishwheels.findOne(
    { channel_id },
    { timeout: true }
  );
  if (dishwheel) {
    if (dishwheel.dishwashers.includes(person)) {
      respondWithMessage("You are already on the dishwheel.");
    } else {
      await collectionOfDishwheels.updateOne(
        { channel_id },
        {
          $set: {
            ...dishwheel,
            dishwashers: dishwheel.dishwashers.concat([person]),
          },
        }
      );
      respondWithMessage(`Added ${person} to dishwheel.`);
    }
  } else {
    await collectionOfDishwheels.insertOne({
      channel_id,
      creatorId: user_id,
      currentDishwasher: person,
      dateCurrentDishwasherStarted: new Date().toString(),
      dishwashers: [person],
      fineAmount: 0,
      finePeriodicity: 0,
      secondsUntilFine: 0,
    });
    respondWithMessage(`Created dishwheel and added ${person}`);
  }
  close();
};
