import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CATEGORIES } from "./constants/category-catalog.constant";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly ormCategoryRepository: Repository<Category>,
  ) {}

  async seedCategories(): Promise<void> {
    for (const catData of CATEGORIES) {
      const existingCategory = await this.ormCategoryRepository.findOne({
        where: { name: catData.name },
      });
      if (!existingCategory) {
        const newCategory = this.ormCategoryRepository.create({
          name: catData.name,
        });
        await this.ormCategoryRepository.save(newCategory);
      }
    }
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
}
