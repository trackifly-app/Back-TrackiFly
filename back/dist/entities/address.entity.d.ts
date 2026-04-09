import { City } from './city.entity';
export declare class Address {
    id_direccion: string;
    calle: string;
    referencia: string | null;
    codigo_postal: string;
    city: City;
}
