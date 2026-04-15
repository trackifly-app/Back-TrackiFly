import { RegisterUserDto } from '../dtos/register-user.dto';
import { RegisterCompanyDto } from '../dtos/register-company.dto';

export type RegisterDto = RegisterUserDto | RegisterCompanyDto;