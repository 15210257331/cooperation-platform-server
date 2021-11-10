import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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
        name: 'content',
        charset: 'utf8mb4',
        comment: '任务内容',
    })
    content: string;

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
        name: 'createTime',
        comment: '任务创建时间',
    })
    createTime: Date;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'startTime',
        comment: '任务开始时间',
    })
    startTime: Date;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'endTime',
        comment: '任务结束时间',
    })
    endTime: Date;

    /**
     * 任务和任务负责人是多对一的关系
     */
    @ManyToOne(() => User,)
    @JoinColumn()
    principal: User;
}
