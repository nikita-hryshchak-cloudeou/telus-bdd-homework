import { Identificators } from "../Identificators";

export default class AddressContext {
  public identificator: string = Identificators.AddressContext;
  public id: number = NaN;
  public ipAddress: string = "";
  public latFromIp: number = NaN;
  public lonFromIp: number = NaN;
  public textAddress: string = "";
  public latFromText: number = NaN;
  public lonFromText: number = NaN;
  public addressTable: string = "";
  public latColumn: string = "";
  public lonColumn: string = "";
  public distance: number = NaN;
}
