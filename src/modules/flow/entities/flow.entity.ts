import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Project } from '../../project/entities/project.entity';
import { Base } from '../../../common/base.entity';
@Entity()
export class Flow extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    charset: 'utf8mb4',
    length: 10,
    name: 'name',
    comment: '流程节点名称',
  })
  name: string;

  @Column({
    type: 'int',
    name: 'sort',
    nullable: false,
    default: 1,
    comment: '该节点对应的排序标识',
  })
  sort: number;

  @Column({
    type: 'bool',
    name: 'canNew',
    nullable: false,
    default: true,
    comment: '该节点是否可以新建任务',
  })
  canNew: boolean;

  @Column({
    type: 'bool',
    name: 'complete',
    nullable: false,
    default: false,
    comment: '该节点是否标记为任务已完成',
  })
  complete: boolean;

  // 有一种称为simple-array的特殊列类型，保存可流转流程节点的ID
  @Column({
    type: 'simple-array',
    charset: 'utf8mb4',
    comment: '任务流转范围',
    name: 'range',
  })
  range: string[];

  /**
   * 分组和项目是多对一的关系
   */
  @ManyToOne(() => Project, (project) => project.groups)
  @JoinColumn()
  project: Project;

  /**
   * 分组和任务是一对多的关系
   */
  @OneToMany(() => Task, (task) => task.flow)
  tasks: Task[];
}
