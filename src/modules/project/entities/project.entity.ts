import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Flow } from '../../flow/entities/flow.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    charset: 'utf8mb4',
    name: 'name',
    comment: '项目名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    charset: 'utf8mb4',
    length: 30,
    name: 'icon',
    comment: '项目的icon 图标名称',
  })
  icon: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'http://sallery.cn:4000/public/1639992965.webp',
    name: 'cover',
    comment: '项目封面',
  })
  cover: string;

  @Column({
    type: 'int',
    name: 'type',
    nullable: false,
    default: () => 1,
    comment: '项目类型 1.普通项目 2.星标项目',
  })
  type: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'createDate',
    comment: '任务创建时间',
  })
  createDate: Date;

  /**
   * 项目和分组是一对多的关系
   */
  @OneToMany(() => Flow, (flow) => flow.project)
  flows: Flow[];

  /**
   * 项目和用户是多对一的关系
   */
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn()
  belong: User;
}
