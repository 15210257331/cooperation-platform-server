import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
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
export class Tag extends Base {
  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    charset: 'utf8mb4',
    name: 'name',
    comment: '标签名称',
  })
  name: string;

  // 标签和项目多对一
  @ManyToOne(() => Project, (project) => project.tags)
  @JoinColumn()
  project: Project;

  // 标签和任务多对一
  @ManyToOne(() => Task, (task) => task.tags)
  @JoinColumn()
  task: Task;
}
