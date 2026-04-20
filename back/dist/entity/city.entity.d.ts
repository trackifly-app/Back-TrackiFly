import { Country } from './country.entity';
import { Address } from './address.entity';
export declare class City {
    id_ciudad: string;
    nombre: string;
    country: Country;
    estado_provincia: string;
    addresses: Address[];
}
