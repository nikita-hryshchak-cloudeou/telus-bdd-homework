import { featureContext, postgresQueryExecutor } from "@cloudeou/telus-bdd";
import { Identificators } from "../../contexts/Identificators";
import { IpApiClient } from "../../../bdd-src/address-check/ip-api/ip-api.api";
import ErrorContext from "../../contexts/address-check/ErrorContext";
import AddressContext from "../../contexts/address-check/AddressContext";
import { writeCoordinatesToDbQuery } from "../../../bdd-src/db/db-queries";
import { MapBoxClient } from "../../../bdd-src/address-check/mapbox/mapbox.api";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const addressCheckSteps = ({
  given,
  when,
  then,
}: {
  [key: string]: step;
}) => {
  const errorContext = (): ErrorContext =>
    featureContext().getContextById(Identificators.ErrorContext);
  const addressContext = (): AddressContext =>
    featureContext().getContextById(Identificators.AddressContext);

  const ipApiClient = new IpApiClient();
  const mapBoxClient = new MapBoxClient();

  given(/^address (.*) is (.*)$/, (paramName: string, paramValue: any) => {
    console.log(`Setting ${paramName} to ${paramValue}`);
    switch (paramName) {
      case "id":
        return (addressContext().id = paramValue);
      case "ip":
        return (addressContext().ipAddress = paramValue);
      case "text":
        return (addressContext().textAddress = paramValue);
      case "table":
        return (addressContext().addressTable = paramValue);
    }
  });

  when(/^geocode (.*) address$/, async (paramValue: string) => {
    try {
      console.log("Getting coordinates from api");
      switch (paramValue) {
        case "ip":
          const ipAddress: string = addressContext().ipAddress;
          const coordsFromIp = await ipApiClient.getIpGeocode(ipAddress);
          addressContext().latFromIp = coordsFromIp.lat;
          addressContext().lonFromIp = coordsFromIp.lon;
          break;
        case "text":
          const textAddress: string = addressContext().textAddress;
          const coordsFromText = await mapBoxClient.getAdressGeocode(
            textAddress
          );
          addressContext().latFromText = coordsFromText.lat;
          addressContext().lonFromText = coordsFromText.lon;
          break;
      }
    } catch (error) {
      const errorJson = JSON.stringify(error);
      const errorText = `Error while writing coordinates to DB: ${errorJson}`;
      console.log(errorText);
      errorContext().error = errorText;
    }
  });

  then(
    /^write location to db lat (.*) lon (.*)$/,
    async (latCol: string, lonCol: string) => {
      try {
        console.log("Writing coordinates to DB");
        switch (latCol) {
          case "ip_lat":
            await postgresQueryExecutor(
              writeCoordinatesToDbQuery(
                addressContext().id,
                latCol,
                lonCol,
                addressContext().latFromIp,
                addressContext().lonFromIp
              )
            );
            break;
          case "address_lat":
            await postgresQueryExecutor(
              writeCoordinatesToDbQuery(
                addressContext().id,
                latCol,
                lonCol,
                addressContext().latFromText,
                addressContext().lonFromText
              )
            );
            break;
        }
      } catch (error) {
        const errorJson = JSON.stringify(error);
        const errorText = `Error while writing coordinates to DB: ${errorJson}`;
        console.log(errorText);
        errorContext().error = errorText;
      }
    }
  );
};
