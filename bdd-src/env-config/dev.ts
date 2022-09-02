export const envConfig = {
  envName: "dev",
  ipApi: {
    baseUrl: "http://ip-api.com/json",
  },
  mapBox: {
    baseUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places",
    apiKey: process.env.MAP_BOX_API_KEY,
  },
};
