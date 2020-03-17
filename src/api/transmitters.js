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


export const getConfigurationsFromAPI = async (configurationKey) => {
  const dataUrl = `${PROD_API_URL}/cfg`;

  const response = await fetch(dataUrl)
    .then((res) => res.json());

  if (response.success) {
    const configurations = response.data;
    let selectedConfiguration = '';

    configurations.forEach((configuration) => {
      if (configuration.cfg === configurationKey) {
        selectedConfiguration = configuration;
      }
    });

    return { selectedConfiguration, configurations };
  }
  throw Error(response.err_msg);
};
