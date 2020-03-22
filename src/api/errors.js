const { PROD_API_URL } = process.env;

export const postError = (body) => {
  fetch(`${PROD_API_URL}/submitErrorJson`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Host: 'mapy.radiopolska.pl',
      'Content-Type': 'application/json',
      'Content-Length': 122,
    },
    body: JSON.stringify({ app: 'mapyrp', ...body }),
  });
};
