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

  /**
   * 项目和分组是一对多的关系
   */
  @OneToMany(() => Flow, (flow) => flow.project)
  groups: Flow[];

  /**
   * 项目和用户是多对一的关系
   */
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn()
  belong: User;
}
