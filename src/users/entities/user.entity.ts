import { Roles } from 'src/utility/common/user_roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({})
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column(
    { select: false }, // for hiding password from select query
  )
  password?: string;
  @Column({ type: 'enum', enum: Roles, default: [Roles.USER], array: true })
  role: Roles[];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
}
