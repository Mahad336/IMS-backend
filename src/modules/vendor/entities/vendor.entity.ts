import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Item } from 'src/modules/item/entities/item.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact: string;

  @ManyToOne(() => Organization, (organization) => organization.category)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToMany(() => Category, {
    nullable: true,
  })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Category, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  subcategories: Category[];

  @OneToMany(() => Item, (item) => item.vendor)
  item: Item;
}
