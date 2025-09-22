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
import { Base } from '../../../common/base.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Iteration } from '../../iteration/entities/iteration.entity';
export enum ProjectType {
  group = 'group',
  general = 'general',
}
@Entity()
export class Project extends Base {
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
    type: 'text',
    nullable: true,
    name: 'detail',
    charset: 'utf8mb4',
    comment: '任务描述',
  })
  description: string;

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
    type: 'bool',
    name: 'star',
    nullable: false,
    default: false,
    comment: '是否星标项目',
  })
  star: boolean;

  @Column({
    type: 'enum',
    name: 'type',
    enum: ProjectType,
    default: ProjectType.group,
    nullable: false,
    comment: '项目类型',
  })
  type: string;

  @Column({
    type: 'varchar',
    name: 'remindInterval',
    nullable: true,
    default: '2',
    charset: 'utf8mb4',
    comment: '提醒间隔',
  })
  remindInterval: string;

  @Column({
    type: 'varchar',
    name: 'remindType',
    nullable: true,
    default: '1,2,3',
    charset: 'utf8mb4',
    comment: '提醒方式',
  })
  remindType: string;

  @Column({
    type: 'int',
    name: 'status',
    default: 1,
    nullable: true,
    comment: '项目状态',
  })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'startDate',
    comment: '开始时间',
  })
  startDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'endDate',
    comment: '结束时间',
  })
  endDate: Date;

  /**
   * 项目和分组是一对多的关系
   */
  @OneToMany(() => Flow, (flow) => flow.project)
  groups: Flow[];

  /**
   * 项目和标签是一对多的关系
   */
  @OneToMany(() => Tag, (tag) => tag.project)
  tags: Tag[];

  /**
   * 项目和迭代是一对多的关系
   */
  @OneToMany(() => Iteration, (iteration) => iteration.project)
  iterations: Iteration[];

  /**
   * 项目和用户是多对多的关系
   */
  @ManyToMany(() => User, (user) => user.projects)
  members: User[];
}
