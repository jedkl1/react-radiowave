const { PROD_API_URL } = process.env;

export const fetchTransmittersBySystem = async (system) => {
  const dataUrl = `${PROD_API_URL}/transmitterAll/pl/${system}`;

  const response = await fetch(dataUrl)
    .then((res) => res.json());

  if (response.success && response.data.length) {
    return response.data || [];
  }
  throw Error(response.err_msg);
};


export const fetchAPIConfigurations = async (configurationKey) => {
  const dataUrl = `${PROD_API_URL}/cfg`;

  const response = await fetch(dataUrl)
    .then((res) => res.json());

  if (response.success) {
    const configurations = response.data;
    const selectedConfiguration = configurations.filter(
      (configuration) => configuration.cfg === configurationKey,
    );

    return { selectedConfiguration, configurations };
  }
  throw Error(response.err_msg);
};

const fetchTransmitterById = async (url) => {
  const response = await fetch(url)
    .then((res) => res.json());

  if (response.success && response.data.length) {
    return response.data[0] || undefined;
  }
  if (!response.success) {
    throw Error(response.err_msg);
  }
  throw Error('Brak nadajnika o podanym id w bazie danych');
};

export const fetchTransmittersArray = async (ids, system) => {
  const requests = ids.map((id) => {
    const url = `${PROD_API_URL}/transmitterById/pl/${system}/${id}`;

    return fetchTransmitterById(url)
      .then((transmitter) => transmitter)
      .catch((e) => console.error(e));
  });

  return Promise.all(requests);
};
