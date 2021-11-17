import { group } from 'console';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: string;

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
        comment: '任务详情',
    })
    detail: string;

    @Column({
        type: 'int',
        name: 'status',
        default: 1,
        nullable: false,
        comment: '任务状态 1未开始  2进行中  3已完成  4已作废  5 已删除'
    })
    status: number;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'number',
        comment: '项目编号'
    })
    number: string;

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


    /**
     * 任务和用户是多对一的关系
     * ManyToOne 可以省略JoinColumn装饰器
     * 拥有ManyToOne装饰器的表会生成外键
     * 外键默认名称是 字段名+关联的表的主键名
     * 如果不特殊指定那这里的外键是 creatorId
     */
     @ManyToOne(() => User, user => user.tasks)
     @JoinColumn()
     owner: User;

    /**
     * 任务和分组是多对一的关系
     * 多个任务隶属于同一个分组
     */
     @ManyToOne(() => Group, group => group.tasks)
     @JoinColumn()
     group: Group;
}
