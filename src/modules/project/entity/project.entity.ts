import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Flow } from '../../task/entity/flow.entity';
import { Task } from '../../task/entity/task.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { encryptPassword } from '../../../utils';
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true,
    name: 'name',
    comment: '项目名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'host',
    comment: '主机地址',
  })
  host: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'port',
    comment: '主机端口',
  })
  port: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'repository',
    comment: '项目仓库地址',
  })
  repository: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'username',
    comment: '主机用户名',
  })
  username: string;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
    name: 'password',
    comment: '主机密码',
  })
  password: string;

  @Column({
    type: 'int',
    name: 'project_type',
    default: () => 1,
    nullable: false,
    comment: '项目类型 1 前端项目 2 后端项目',
  })
  projectType: number;

  @Column({
    type: 'int',
    name: 'deploy_type',
    default: () => 1,
    nullable: false,
    comment: '部署方式 1 静态部署 2 docker部署',
  })
  deployType: number;

  @Column({
    type: 'text',
    name: 'remark',
    nullable: true,
    comment: '项目备注',
  })
  remark: string;

  // 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置
  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'createDate',
    comment: '创建时间',
  })
  createDate: Date;
}
