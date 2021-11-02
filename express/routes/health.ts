import { RequestHandler } from "express";
import { connect } from "../../mongodb";
import { errorToJson } from "../utils/errorToJson";

export const health: RequestHandler = (req, res) =>
  connect()
    .then(async ([, close]) => {
      res.send("Health Check: UP");
      close();
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      res.send(errorToJson(error));
    });
