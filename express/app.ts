import express from "express";
import { urlencoded, json } from "body-parser";
import { connect } from "../mongodb";
import { done } from "./routes/done";
import { join } from "./routes/join";

export const runApp = async () => {
  const app = express();
  const [mongo] = await connect();

  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.post("/done", done);
  app.post("/join", join);

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Listening on port: ${port}`));
};
