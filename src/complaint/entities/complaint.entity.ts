import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  suggestion: string;

  @CreateDateColumn()
  submissionDate: Date;

  @ManyToOne(() => User, (user) => user.complaints)
  submittedBy: User; // foreign key to User entity

  @Column()
  status: string;

  @ManyToOne(() => Organization, (organization) => organization.complaints)
  organization: Organization; // foreign key to Organization entity

  @ManyToOne(() => User, (user) => user.complaints)
  actionBy?: User;

  @Column({ nullable: true })
  actionDateTime?: Date;
}
