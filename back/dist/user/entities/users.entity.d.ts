import { Gender } from '../../common/gender.enum';
import { Role } from './roles.entity';
export declare class Users {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    phone: number;
    gender: Gender;
    birthdate: string;
    country: string;
    role: Role;
}
