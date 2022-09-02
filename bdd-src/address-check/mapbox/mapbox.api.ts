import { envConfig } from "../../env-config";
import { axiosInstance } from "../axiosInstance";

export class MapBoxClient {
  public async getAdressGeocode(
    textAdress: string
  ): Promise<{ lat: number; lon: number }> {
    try {
      console.log(`Geocoding text address: ${textAdress}`);
      const response = await axiosInstance({
        method: "GET",
        url: `${envConfig.mapBox.baseUrl}/${textAdress}.json?access_token=${envConfig.mapBox.apiKey}`,
      });
      const lat = response.data.features[0].center[1];
      const lon = response.data.features[0].center[0];
      console.log(`Got coordinates: ${lat}, ${lon}`);
      return { lat, lon };
    } catch (error) {
      const errorText = `Error while geocoding text address: ${textAdress}\n${JSON.stringify(
        error
      )}`;
      console.log(errorText);
      throw new Error(errorText);
    }
  }
}
