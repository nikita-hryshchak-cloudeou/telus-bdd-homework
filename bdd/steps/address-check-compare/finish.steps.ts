import { featureContext, postgresQueryExecutor } from "@cloudeou/telus-bdd";
import { Identificators } from "../../contexts/Identificators";
import ErrorContext from "../../contexts/address-check/ErrorContext";
import AddressContext from "../../contexts/address-check/AddressContext";
import { finishAddressFeature } from "../../../bdd-src/db/db-queries";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const addressFinish = ({ when }: { [key: string]: step }) => {
  const errorContext = (): ErrorContext =>
    featureContext().getContextById(Identificators.ErrorContext);
  const addressContext = (): AddressContext =>
    featureContext().getContextById(Identificators.AddressContext);

  when("finish process for address", async () => {
    try {
      await postgresQueryExecutor(finishAddressFeature(addressContext().id));
    } catch (error) {
      const errorJson = JSON.stringify(error);
      const errorText = `Error while writing coordinates to DB: ${errorJson}`;
      console.log(errorText);
      errorContext().error = errorText;
    }
  });
};
