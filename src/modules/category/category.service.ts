import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Item } from '../item/entities/item.entity';
import { IsNull } from 'typeorm';
import { Request } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return await this.categoryRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async getSubCategoriesForCategory(): Promise<any[]> {
    let categories = [];

    //filtering categoies on admin's based organization id
    categories = await this.categoryRepository.find({
      relations: ['subcategories'],
      where: {
        parent: IsNull(),
        organization: {
          id: 1,
        },
      },
    });

    const CategoriesData = await Promise.all(
      categories.map(async (category) => {
        const subCategories = category.subcategories;

        const subCategoriesData = await Promise.all(
          subCategories.map(async (subCategory) => {
            const items = await this.itemRepository.find({
              where: { subcategory: subCategory },
              relations: ['requests', 'vendor'],
            });

            const quantity = items.length;
            const assigned = items.filter(
              (item) => item.assignedTo != null,
            ).length;
            const unassigned = items.filter(
              (item) => item.assignedTo == null,
            ).length;
            const faulty = items.filter((item) =>
              item.requests?.some((request) => request.type === 'faulty'),
            ).length;
            const vendorNames = items.reduce((acc, item) => {
              if (item.vendor) {
                if (!acc.includes(item.vendor.name)) {
                  acc.push(item.vendor.name);
                }
              }
              return acc;
            }, []);

            return {
              id: subCategory.id,
              name: subCategory.name,
              vendorNames,
              quantity: quantity,
              assigned: assigned,
              unassigned: unassigned,
              faulty: faulty,
            };
          }),
        );

        //Fetching vendors count associated with the given category from vendor_categories_category

        const vendorsCountQuery = `
                      SELECT COUNT(DISTINCT "vendorId")
                      FROM "vendor_categories_category"
                      WHERE "categoryId" = $1`;
        const result = await this.entityManager.query(vendorsCountQuery, [
          category.id,
        ]);

        const vendorsCount = parseInt(result[0].count);

        return {
          id: category.id,
          name: category.name,
          vendorsCount,
          subCategoryCount: subCategories.length,
          subCategories: subCategoriesData,
        };
      }),
    );

    return CategoriesData;
  }
}
