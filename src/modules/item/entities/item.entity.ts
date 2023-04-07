import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Vendor } from 'src/modules/vendor/entities/vendor.entity';
import { Request } from 'src/modules/request/entities/request.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serialNumber: string;

  @Column()
  description: string;

  @Column()
  unitPrice: number;

  @CreateDateColumn()
  dateOfPurchase: Date;

  @Column()
  currentPrice: number;

  @Column()
  deprecatedPrice: number;

  @Column()
  percentageDepreciation: number;

  @Column({ nullable: true })
  assignedTo: string;

  @ManyToOne(() => Category, (category) => category.item)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Category, (category) => category.item)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Category;

  @ManyToOne(() => Vendor, (vendor) => vendor.item)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => Organization, (organization) => organization.category)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => Request, (request) => request.item)
  requests: Request[];
}
