import Redis from "ioredis";
import { v4 as generateId } from "uuid";
import Dishwheel from "./types/dishwheel";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not specified");
}
const redis = new Redis(redisUrl);

const dishwheelsKey = "dishwheels";

export const postDishwheel = async (
  channelId: string,
  creatorId: string,
  firstDishwasher: string
): Promise<void> => {
  const existingDishwheels = await getDishwheels();
  const combinedDishwheels: Dishwheel[] = existingDishwheels.concat([
    {
      id: generateId(),
      currentDishwasher: firstDishwasher,
      creatorId,
      channel_id: channelId,
      dateCurrentDishwasherStarted: new Date().toISOString(),
      dishwashers: [firstDishwasher],
      fineAmount: 0,
      finePeriodicity: 0,
      secondsUntilFine: 0,
    },
  ]);
  redis.set(dishwheelsKey, combinedDishwheels);
};

export const updateDishweel = async (
  dishwheel: Partial<Dishwheel>
): Promise<void> => {
  const existingDishwheels = await getDishwheels();
  const existingDishwheel = existingDishwheels.find(
    (possibleDishwheel) =>
      possibleDishwheel.channel_id === dishwheel.channel_id ||
      possibleDishwheel.id === dishwheel.id
  );
  if (!existingDishwheel) {
    throw new Error("Dishweel does not exist");
  }
  const updatedDishwheels: Dishwheel[] = existingDishwheels.map(
    (existingDishwheel) => {
      if (
        existingDishwheel.id === dishwheel.id ||
        existingDishwheel.channel_id === dishwheel.channel_id
      ) {
        return {
          ...existingDishwheel,
          ...dishwheel,
          id: existingDishwheel.id,
          channel_id: existingDishwheel.channel_id,
        };
      }
      return existingDishwheel;
    }
  );
  redis.set(dishwheelsKey, updatedDishwheels);
};

export const getDishwheels = async (): Promise<Dishwheel[]> => {
  const existingDishwheelsString = await redis.get(dishwheelsKey);
  if (!existingDishwheelsString) {
    redis.set(dishwheelsKey, []);
    return [];
  }
  return JSON.parse(existingDishwheelsString);
};
