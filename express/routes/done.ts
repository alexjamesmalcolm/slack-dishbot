import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import Dishwheel from "../../types/dishwheel";
import SlashMessage from "../../types/slash-message";

export const done: RequestHandler = async (req, res) => {
  const message = req.body as SlashMessage;
  res.send();
  fetch(message.response_url, {
    method: "POST",
    body: JSON.stringify({ text: "Finished" }),
  });
};
