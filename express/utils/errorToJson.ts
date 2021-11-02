export const errorToJson = (error: Error) =>
  JSON.stringify(error, Object.getOwnPropertyNames(error));
