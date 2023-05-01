import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from 'src/modules/vendor/entities/vendor.entity';
import { Item } from 'src/modules/item/entities/item.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  subcategories: Category[];

  @OneToMany(() => Item, (item) => item.category)
  item?: Item;

  @ManyToOne(() => Organization, (organization) => organization.category)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToMany(() => Vendor)
  vendors: Vendor[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
