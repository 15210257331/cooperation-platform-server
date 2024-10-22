import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  Generated,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Task } from '../../task/entities/task.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { encryptPassword } from '../../../utils';
import { Project } from '../../project/entities/project.entity';
import { Base } from '../../../common/base.entity';
import { User } from './user.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}
@Entity()
export class Role extends Base {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true,
    comment: '角色名称',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    charset: 'utf8mb4',
    comment: '角色描述',
  })
  description: string;

  @Column({
    type: 'int',
    name: 'permission',
    nullable: false,
    default: 0,
    comment: '角色权限',
  })
  permission: number;

  @Column({
    type: 'int',
    name: 'inlay',
    nullable: false,
    default: 0, 
    comment: '是否内置角色 0 否 1 是',
  })
  inlay: number;

  //角色和用户多对对
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
