import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('user/:userId')
  async getCompanyByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Company> {
    return this.companiesService.getCompanyByUserId(userId);
  }

  @Put('user/:userId')
  async updateCompany(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateData: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.updateCompany(userId, updateData);
  }
}
