import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { CategorySeeder } from "./seeds/category.seeder";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesRepository, CategoriesService, CategorySeeder],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
