export const envConfig = {
  envName: "prod",
  ipApi: {
    baseUrl: "https://cloudapps.telus.com/ip-api/json",
  },
  mapBox: {
    baseUrl: "https://cloudapps.telus.com/mapbox/geocoding/v5/mapbox.places",
    apiKey: process.env.MAP_BOX_API_KEY,
  },
};
