import { RegisterUserDto } from '../dtos/register-user.dto';
import { RegisterCompanyDto } from '../dtos/register-company.dto';
import { RegisterOperatorDto } from '../dtos/register-operator.dto';

export type RegisterDto = RegisterUserDto | RegisterCompanyDto | RegisterOperatorDto;