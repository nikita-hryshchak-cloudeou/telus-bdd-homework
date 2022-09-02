import { featureContext, postgresQueryExecutor } from "@cloudeou/telus-bdd";
import { Identificators } from "../../contexts/Identificators";
import ErrorContext from "../../contexts/address-check/ErrorContext";
import AddressContext from "../../contexts/address-check/AddressContext";
import { writeCorrectToDbQuery } from "../../../bdd-src/db/db-queries";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const addressCompareSteps = ({
  when,
  then,
}: {
  [key: string]: step;
}) => {
  const errorContext = (): ErrorContext =>
    featureContext().getContextById(Identificators.ErrorContext);
  const addressContext = (): AddressContext =>
    featureContext().getContextById(Identificators.AddressContext);

  const getLongitudeValue = (latitude: number): number => {
    const OneDegreeLongitudeValueInMetersAtEquator = 111320;
    return (
      Math.cos((latitude / 180) * Math.PI) *
      OneDegreeLongitudeValueInMetersAtEquator
    );
  };
  const getLatitudeValue = () => 111320;

  when("calculate distanse beetween points", () => {
    console.log("Calculating distance between 2 points");
    const context = addressContext();
    const latDif = Math.abs(context.latFromIp - context.latFromText);
    const lonDif = Math.abs(context.lonFromIp - context.lonFromText);
    const avgLat = (context.latFromIp + context.latFromText) / 2;
    const xDif = getLongitudeValue(avgLat) * lonDif;
    const yDif = getLatitudeValue() * latDif;
    const distanse = Math.round(
      Math.sqrt(Math.pow(xDif, 2) + Math.pow(yDif, 2))
    );
    addressContext().distance = distanse;
    console.log(`Distance between 2 points is ${distanse} meters`);
  });

  then(/^distanse is less than (\d+) meters$/, async (paramValue: number) => {
    try {
      console.log("Validating results");
      if (addressContext().distance > paramValue) {
        await postgresQueryExecutor(
          writeCorrectToDbQuery(
            addressContext().id,
            false,
            `calculated distance(${
              addressContext().distance
            } meters) is greater than ${paramValue} meters)`
          )
        );
      } else {
        await postgresQueryExecutor(
          writeCorrectToDbQuery(addressContext().id, true, "")
        );
      }
    } catch (error) {
      const errorJson = JSON.stringify(error);
      const errorText = `Error while writing correct column to DB: ${errorJson}`;
      console.log(errorText);
      errorContext().error = errorText;
    }
  });
};
