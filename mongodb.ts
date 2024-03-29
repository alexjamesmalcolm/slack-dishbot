import { Db, MongoClient } from "mongodb";

export const connect = async (): Promise<[Db, () => void]> => {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not defined");
  }
  try {
    const client = await new MongoClient(uri, {}).connect();
    const close = () => {
      try {
        client.close();
      } catch (error) {}
    };
    return [client.db("dishbot"), close];
  } catch (error) {
    throw new Error(
      `There was an issue attempting to connect to ${uri}\n${error}`
    );
  }
};
