import SlashMessage from "./slash-message";

interface Dishwheel {
  channel_id: SlashMessage["channel_id"];
  dishwashers: string[];
  dateCurrentDishwasherStarted: string;
  fineAmount: number;
  secondsUntilFine: number;
  finePeriodicity: number;
  currentDishwasher: string;
  creatorId: SlashMessage["user_id"];
}

export default Dishwheel;
