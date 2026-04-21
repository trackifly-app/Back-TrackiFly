import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  create(dto: CreateCategoryDto) {
    return this.categoriesRepository.createCategory(dto);
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findById(id: string) {
    return this.categoriesRepository.findById(id);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, dto);
  }

  delete(id: string) {
    return this.categoriesRepository.deleteCategory(id);
  }
}
