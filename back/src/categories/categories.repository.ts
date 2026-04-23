import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly ormCategoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category = this.ormCategoryRepository.create(dto);
    return this.ormCategoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.ormCategoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.ormCategoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException("Categoría no encontrada");
    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.ormCategoryRepository.update(id, dto);
    return this.findById(id);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.ormCategoryRepository.delete(id);
  }
}
