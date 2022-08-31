import { Identificators } from '../Identificators';

export default class AddressContext {
    public identificator: string = Identificators.AddressContext;
    public id: number = NaN;
    public ipAddress: string = '';
    public textAddress: string = '';
    public lat: number = NaN;
    public lon: number = NaN;
    public addressTable: string = '';
    public latColumn: string = '';
    public lonColumn: string = '';
}