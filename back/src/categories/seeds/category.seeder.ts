import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CategoriesService } from "../categories.service";

const DEFAULT_CATEGORIES = [
  { name: "Tecnología", description: "Productos y servicios tecnológicos" },
  { name: "Hogar", description: "Artículos para el hogar" },
  { name: "Deportes", description: "Equipamiento y ropa deportiva" },
  { name: "Ropa", description: "Ropa y accesorios de moda" },
  { name: "Salud", description: "Productos y servicios de salud" },
];

@Injectable()
export class CategorySeeder implements OnApplicationBootstrap {
  constructor(private readonly categoriesService: CategoriesService) {}

  async onApplicationBootstrap() {
    for (const cat of DEFAULT_CATEGORIES) {
      try {
        await this.categoriesService.create(cat);
      } catch (e) {
      }
    }
    console.log("Categorías por defecto cargadas");
  }
}
