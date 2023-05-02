import { User } from 'src/modules/user/entities/user.entity';
import { Request } from 'src/modules/request/entities/request.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Complaint } from 'src/modules/complaint/entities/complaint.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Item } from 'src/modules/item/entities/item.entity';
import { Vendor } from 'src/modules/vendor/entities/vendor.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  image?: string;

  @Column()
  bio: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  zip: number;

  @Column()
  representativeName: string;

  @Column()
  representativeContact: string;

  @OneToMany(() => User, (user) => user.organization)
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  user?: User;

  @OneToMany(() => Category, (category) => category.organization)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @OneToMany(() => Item, (item) => item.organization)
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item?: Item;

  @OneToMany(() => Vendor, (vendor) => vendor.organization)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor?: Vendor;

  @OneToMany(() => Request, (request) => request.organization)
  requests?: Request[];

  @OneToMany(() => Complaint, (complaint) => complaint.organization)
  complaints?: Complaint[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
