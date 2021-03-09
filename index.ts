import express from "express";
import fetch from "node-fetch";
import { urlencoded, json } from "body-parser";
import SlashMessage from "./types/slash-message";
import { getDishwheels, postDishwheel, updateDishweel } from "./redis";

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.post("/done", async (req, res) => {
  const message = req.body as SlashMessage;
  res.send();
  fetch(message.response_url, {
    method: "POST",
    body: JSON.stringify({ text: "Finished" }),
  });
});
app.post("/add", async (req, res) => {
  res.send();
  const {
    text: person,
    response_url: responseUrl,
    channel_id,
    user_id,
  } = req.body as SlashMessage;
  const dishwheels = await getDishwheels();
  const possibleDishwheel = dishwheels.find(
    (dishwheel) => dishwheel.channel_id === channel_id
  );
  if (possibleDishwheel) {
    const { dishwashers } = possibleDishwheel;
    const isAlreadyAdded = dishwashers.some(
      (dishwasher) => dishwasher === person
    );
    if (isAlreadyAdded) {
      fetch(responseUrl, {
        method: "POST",
        body: JSON.stringify({
          text: `${person} has already been added to the dishwheel`,
        }),
      });
    } else {
      await updateDishweel({
        ...possibleDishwheel,
        dishwashers: dishwashers.concat([person]),
      });
      fetch(responseUrl, {
        method: "POST",
        body: JSON.stringify({ text: `Added ${person} to dishwheel` }),
      });
    }
  } else {
    await postDishwheel(channel_id, user_id, person);
    fetch(responseUrl, {
      method: "POST",
      body: JSON.stringify({ text: `Created Dishwheel and added ${person}.` }),
    });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
