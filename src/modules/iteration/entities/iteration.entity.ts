import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Flow } from '../../flow/entities/flow.entity';
import { Base } from '../../../common/base.entity';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Iteration extends Base {
  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    charset: 'utf8mb4',
    name: 'name',
    comment: '迭代名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    charset: 'utf8mb4',
    length: 30,
    name: 'type',
    comment: '迭代类型',
  })
  type: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'status',
    default: 1,
    comment: '迭代状态 1 未开始 2 进行中 3已完成',
  })
  status: number;

  @Column({
    type: 'int',
    name: 'progress',
    default: 0,
    nullable: false,
    comment: '迭代进度 1~100',
  })
  progress: number;

  @Column({
    type: 'text',
    nullable: false,
    charset: 'utf8mb4',
    name: 'content',
    comment: '迭代内容',
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
    charset: 'utf8mb4',
    name: 'attachment',
    comment: '迭代附件',
  })
  attachment: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'startDate',
    comment: '迭代开始时间',
  })
  startDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'endDate',
    comment: '迭代结束时间',
  })
  endDate: Date;

  // 迭代和项目多对一
  @ManyToOne(() => Project, (project) => project.iterations)
  @JoinColumn()
  project: Project;

  /**
   * 迭代和负责人是多对一的关系
   */
  @ManyToOne(() => User, (user) => user.iterations)
  @JoinColumn()
  principal: User;

  // 迭代和任务一对多
  @OneToMany(() => Task, (task) => task.iteration)
  tasks: Task[];
}
