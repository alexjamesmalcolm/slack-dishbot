export const respond = (responseUrl: string) => (message: string) =>
  fetch(responseUrl, {
    method: "POST",
    body: JSON.stringify({
      text: message,
    }),
  });
