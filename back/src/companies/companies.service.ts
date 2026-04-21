import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async getCompanyByUserId(userId: string): Promise<Company> {
    return this.companiesRepository.getCompanyByUserId(userId);
  }

  async updateCompany(
    userId: string,
    updateData: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesRepository.updateCompany(userId, updateData);
  }

  async updateCompanyImage(
    userId: string,
    profileImage: string,
  ): Promise<Company> {
    return this.companiesRepository.updateCompanyImage(userId, profileImage);
  }
}
