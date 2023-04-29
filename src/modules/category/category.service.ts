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
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
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

  async getSubCategoriesForCategory(user: User): Promise<any[]> {
    let categories = [];

    //filtering categoies on admin's based organization id
    categories = await this.categoryRepository.find({
      relations: ['subcategories'],
      where: {
        parent: IsNull(),
        organization: {
          id: user.organizationId,
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

            const vendorNames = (
              await this.vendorRepository.find({
                relations: ['subcategories'],
                where: { subcategories: { id: subCategory.id } },
              })
            )
              .map((vendor) => vendor.name)
              .join(', ');

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
