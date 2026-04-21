import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectRepository(Company)
    private readonly ormCompaniesRepository: Repository<Company>,
  ) {}

  async getCompanyByUserId(userId: string): Promise<Company> {
    const company = await this.ormCompaniesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!company) {
      throw new NotFoundException(
        `No se encontró empresa para el usuario con id: ${userId}`,
      );
    }
    return company;
  }

  async updateCompany(
    userId: string,
    updateData: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.getCompanyByUserId(userId);
    const merged = this.ormCompaniesRepository.merge(company, updateData);
    return this.ormCompaniesRepository.save(merged);
  }

  async updateCompanyImage(
    userId: string,
    profile_image: string,
  ): Promise<Company> {
    const company = await this.getCompanyByUserId(userId);
    company.profile_image = profile_image;
    return this.ormCompaniesRepository.save(company);
  }
}
