const { PROD_API_URL } = process.env;

export const getTransmittersBySystem = async (system) => {
  const dataUrl = `${PROD_API_URL}/transmitterAll/pl/${system}`;

  const response = await fetch(dataUrl)
    .then((res) => res.json());

  if (response.success) {
    return response.data;
  }
  throw Error(response.err_msg);
};
