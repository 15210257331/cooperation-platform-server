import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Flow } from '../../flow/entities/flow.entity';
import { Base } from '../../../common/base.entity';
import { Tag } from '../../tag/entities/tag.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Task extends Base {
  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    charset: 'utf8mb4',
    name: 'name',
    comment: '任务名称',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'detail',
    charset: 'utf8mb4',
    comment: '任务描述',
  })
  description: string;

  @Column({
    type: 'int',
    name: 'priority',
    default: 1,
    nullable: false,
    comment: '任务优先级 1L1  2L2  3L3 4L4 5L5 6L6  依次升高',
  })
  priority: number;

  @Column({
    type: 'int',
    name: 'progress',
    default: 0,
    nullable: false,
    comment: '任务进度 1~100',
  })
  progress: number;

  @Column({
    type: 'int',
    name: 'remind',
    default: 1,
    nullable: true,
    comment: '设置提醒',
  })
  remind: number;

  @Column({
    type: 'bool',
    name: 'complete',
    nullable: false,
    default: false,
    comment: '任务是否已完成',
  })
  complete: boolean;

  @Column({
    type: 'bool',
    name: 'delete',
    nullable: false,
    default: false,
    comment: '任务是否已删除',
  })
  delete: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'createDate',
    comment: '任务创建时间',
  })
  createDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'startDate',
    comment: '任务开始时间',
  })
  startDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'endDate',
    comment: '任务结束时间',
  })
  endDate: Date;

  @ManyToOne(() => Flow, (flow) => flow.tasks)
  @JoinColumn()
  flow: Flow;

  /**
   * 任务和用户是多对一的关系
   * 多个任务隶属于同一个分组
   */
  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Tag, (tag) => tag.task)
  tags: Tag[];
}
