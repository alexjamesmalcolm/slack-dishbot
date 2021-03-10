import { Db, MongoClient } from "mongodb";

export const connect = async (): Promise<[Db, () => void]> => {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not defined");
  }
  const client = await new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).connect();
  return [client.db("dishbot"), client.close];
};
