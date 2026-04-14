import { IsUUID, IsNotEmpty } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class RegisterEmployeeDto extends RegisterUserDto {
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio' })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  company_id: string;
}