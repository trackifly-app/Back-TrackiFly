import { Gender } from '../../common/gender.enum';
export declare class RegisterUserDto {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: number;
    gender: Gender;
    birthdate: string;
    country: string;
    roleId: string;
}
