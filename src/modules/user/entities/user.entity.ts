import { Role } from 'src/modules/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Request } from 'src/modules/request/entities/request.entity';
import { Complaint } from 'src/modules/complaint/entities/complaint.entity';

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

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.user, {
    eager: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => Request, (request) => request.submittedBy)
  requests?: Request[];

  @OneToMany(() => Complaint, (complaint) => complaint.submittedBy)
  complaints?: Complaint[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
