import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Item } from '../item/entities/item.entity';
import { IsNull } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { ReqTypes } from 'src/common/enums/request-types';

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
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, subCategories, organization } = createCategoryDto;

    // create the main category
    const mainCategory = await this.categoryRepository.save(
      this.categoryRepository.create({
        name,
        organization,
        parentId: null,
      }),
    );

    // create the subcategories and assign the main category's id as their parentId
    const subCategoryEntities = await Promise.all(
      subCategories.map((subCategoryName) =>
        this.categoryRepository.save(
          this.categoryRepository.create({
            name: subCategoryName,
            organization,
            parentId: mainCategory.id,
          }),
        ),
      ),
    );

    return { mainCategory, subCategories: subCategoryEntities };
  }

  async findAll(user: User) {
    return await this.categoryRepository.find({
      relations: ['item'],
      where: { organization: { id: user.organizationId } },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('category.parent', 'parent')
      .where('category.id = :id', { id })
      .getOne();

    const subCategoryVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .innerJoin(
        'vendor.subcategories',
        'subcategories',
        'subcategories.id = :id',
        { id },
      )
      .getMany();

    const categoryVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .innerJoin('vendor.categories', 'categories', 'categories.id = :id', {
        id,
      })
      .getMany();

    const itemStats = await this.getItemStatsCountByCategoryId(id);

    return {
      ...category,
      vendors: category.parent ? subCategoryVendors : categoryVendors,
      itemStats,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, subCategories } = updateCategoryDto;

    // retrieve the category from the database using its ID
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // update the category's name if a new name is provided
    if (name) {
      category.name = name;
      await this.categoryRepository.save(category);
    }

    // update the subcategories if a new set of subcategories is provided
    if (subCategories) {
      // delete all existing subcategories associated with the category
      await this.categoryRepository.delete({ parentId: category.id });

      // create the new subcategories and assign the category's ID as their parentId
      const subCategoryEntities = await Promise.all(
        subCategories.map((subCategoryName) =>
          this.categoryRepository.save(
            this.categoryRepository.create({
              name: subCategoryName,
              organization: category.organization,
              parentId: category.id,
            }),
          ),
        ),
      );
    }

    return { message: 'Category updated successfully' };
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.delete(id);
    return `Category with ID ${id} has been deleted`;
  }

  async getSubCategoriesForCategory(user: User): Promise<any[]> {
    let categories = [];

    //filtering categoies on admin's based organization id
    categories = await this.categoryRepository.find({
      relations: ['subcategories', 'item'],
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
            const {
              totalQuantity: quantity,
              assigned,
              unassigned,
              faulty,
            } = await this.getItemStatsCountByCategoryId(subCategory.id);

            //fetcching vendors having the same subcategory
            const vendorNames = (
              await this.vendorRepository.find({
                relations: ['subcategories'],
                where: { subcategories: { id: subCategory.id } },
              })
            )
              .map((vendor) => vendor?.name)
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

        const vendorsCount = await this.vendorRepository
          .createQueryBuilder('vendor')
          .leftJoin('vendor.categories', 'categories')
          .where('categories.id = :categoryId', {
            categoryId: category.id,
          })
          .select('COUNT(DISTINCT vendor.id)', 'count')
          .getRawOne<{ count: string }>()
          .then((result) => parseInt(result.count));

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

  private async getItemStatsCountByCategoryId(id) {
    const [totalQuantity, assigned, unassigned] = await Promise.all([
      this.itemRepository
        .createQueryBuilder('item')
        .where('item.subcategory.id = :id', { id })
        .getCount(),
      this.itemRepository
        .createQueryBuilder('item')
        .where('item.subcategory.id = :id', { id })
        .andWhere('item.assignedTo IS NOT NULL')
        .getCount(),
      this.itemRepository
        .createQueryBuilder('item')
        .where('item.subcategory.id = :id', { id })
        .andWhere('item.assignedTo IS NULL')
        .getCount(),
    ]);

    const items = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.requests', 'requests')
      .where('item.subcategory.id = :id', { id })
      .getMany();

    const faulty = new Set(
      items
        .filter((item) =>
          item.requests?.some(
            (request) =>
              request.type === ReqTypes.REPAIRED ||
              request.type === ReqTypes.REPLACED,
          ),
        )
        .map((item) => item.id),
    ).size;

    return { totalQuantity, assigned, unassigned, faulty };
  }
}
