import { City } from './city.entity';
import { User } from './user.entity';
export declare class Country {
    id_pais: string;
    nombre: string;
    codigo_iso_2: string;
    codigo_iso_3: string;
    codigo_telefonico: string;
    acronimo: string;
    user: User;
    cities: City[];
}
