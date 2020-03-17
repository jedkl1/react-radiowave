const availableSystems = ['fm', 'dab', 'dvbt'];

export const isValidSystem = (system) => availableSystems.includes(system);
