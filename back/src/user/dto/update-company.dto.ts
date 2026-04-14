import { PartialType } from '@nestjs/swagger';
import { RegisterCompanyDto } from './register-company.dto';

export class UpdateCompanyDto extends PartialType(RegisterCompanyDto) {}