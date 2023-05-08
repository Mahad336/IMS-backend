import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  suggestion?: string;

  @Column({ nullable: true, type: 'text', array: true })
  attachments?: string[];

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.complaints)
  submittedBy: User; // foreign key to User entity

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Organization, (organization) => organization.complaints)
  organization: Organization; // foreign key to Organization entity

  @ManyToOne(() => User, (user) => user.complaints)
  actionBy?: User;

  @Column({ nullable: true })
  actionDateTime?: Date;
}
