import { axiosInstance } from "../axiosInstance";
import { envConfig } from "../../env-config";

export class IpApiClient {
  public async getIpGeocode(
    ipAddress: string
  ): Promise<{ lat: number; lon: number }> {
    try {
      console.log(`Geocoding ip address: ${ipAddress}`);
      const response = await axiosInstance({
        method: "GET",
        url: `${envConfig.ipApi.baseUrl}/${ipAddress}`,
      });
      const { lat, lon } = response.data;
      console.log(`Got coordinates: ${lat}, ${lon}`);
      return { lat, lon };
    } catch (error) {
      const errorText = `Error while geocoding ip address: ${ipAddress} \n ${JSON.stringify(
        error
      )}`;
      console.log(errorText);
      throw new Error(errorText);
    }
  }
}
