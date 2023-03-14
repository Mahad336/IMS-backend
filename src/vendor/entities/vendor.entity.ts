import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact: string;

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

  @OneToMany(() => Item, (item) => item.vendor, { eager: true })
  item: Item;
}
