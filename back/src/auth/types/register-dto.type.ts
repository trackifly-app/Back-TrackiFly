import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterCompanyDto } from '../dto/register-company.dto';
import { RegisterOperatorDto } from '../dto/register-operator.dto';

export type RegisterDto = RegisterUserDto | RegisterCompanyDto | RegisterOperatorDto;