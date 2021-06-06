require("dotenv").config();
import { runApp } from "./express/app";
import { scheduleReminder } from "./schedule/remind";

runApp();
scheduleReminder();
