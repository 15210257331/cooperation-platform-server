import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Flow } from '../../flow/entities/flow.entity';
import { Task } from '../../task/entities/task.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { encryptPassword } from '../../../utils';
import { Project } from '../../project/entities/project.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true,
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Exclude()
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
    name: 'password',
    comment: '密码',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    charset: 'utf8mb4',
    comment: '姓名/昵称',
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 11,
    comment: '手机号',
  })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'http://sallery.cn:4000/public/1639992965.webp',
    name: 'avatar',
    comment: '头像',
  })
  avatar: string;

  @Column({
    type: 'int',
    name: 'role',
    default: () => 1,
    nullable: false,
    comment: '用户角色 1 管理员 2 普通用户',
  })
  role: number;

  @Column({
    type: 'text',
    name: 'intro',
    nullable: true,
    comment: '用户简介',
  })
  intro: string;

  // 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置
  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'createDate',
    comment: '创建时间',
  })
  createDate: Date;

  /**
   * 用户和项目是一对多的关系
   *  */
  @OneToMany(() => Project, (project) => project.belong)
  projects: Project[];

  /**
   * 用户和任务是一对多的关系
   *  */
  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];

  @OneToMany(() => Notification, (message) => message.belong)
  messages: Notification[];

  // 在数据插入数据库的时候 会执行encryptPassword方法
  @BeforeInsert()
  async encryptPassword() {
    this.password = encryptPassword(this.password);
  }
}
