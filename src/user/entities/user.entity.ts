import { Role } from 'src/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Organization } from 'src/organization/entities/organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  passwordResetOtp?: string;

  @Column({ nullable: true })
  passwordResetExpiration?: Date;

  @Column()
  contact: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  education?: string;

  @Column({ nullable: true })
  companyExperience?: number;

  @Column({ nullable: true })
  totalExperience?: number;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @ManyToOne(() => Organization, (organization) => organization.user)
  organization: Organization;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
