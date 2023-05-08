import { User } from 'src/modules/user/entities/user.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from 'src/modules/item/entities/item.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.requests)
  organization: Organization;

  @ManyToOne(() => User, (user) => user.requests)
  submittedBy: User;

  @ManyToOne(() => User, (user) => user.requests)
  actionBy?: User;

  @ManyToOne(() => Item, (item) => item.requests, { eager: true })
  item: Item;

  @Column({ nullable: true })
  actionDateTime?: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
