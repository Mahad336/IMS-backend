import { User } from 'src/user/entities/user.entity';
import { Request } from 'src/request/entities/request.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Complaint } from 'src/complaint/entities/complaint.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  image: string;

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

  @OneToMany(() => Request, (request) => request.organization)
  requests?: Request[];

  @OneToMany(() => Complaint, (complaint) => complaint.organization)
  complaints?: Complaint[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
