import express from "express";
import { urlencoded, json } from "body-parser";
import { done } from "./routes/done";
import { join } from "./routes/join";
import { who } from "./routes/who";

export const runApp = async () => {
  const app = express();

  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.post("/done", done);
  app.post("/join", join);
  app.post("/who", who);

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Listening on port: ${port}`));
};
