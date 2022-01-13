import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';
@Entity()
export class Flow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false,
        charset: 'utf8mb4',
        unique: true,
        length: 10,
        name: 'name',
        comment: '流程节点名称',
    })
    name: string;

    @Column({
        type: 'int',
        name: 'sort',
        nullable: false,
        default: () => 1,
        comment: '该节点对应的排序标识'
    })
    sort: number;

    @Column({
        type: 'bool',
        name: 'canNew',
        nullable: false,
        default: true,
        comment: '该节点是否可以新建任务'
    })
    canNew: boolean;

    @Column({
        type: 'bool',
        name: 'complete',
        nullable: false,
        default: false,
        comment: '该节点是否标记为任务已完成'
    })
    complete: boolean;

    // 有一种称为simple-array的特殊列类型，它可以将原始数组值存储在单个字符串列中
    @Column({
        type: 'simple-array',
        charset: 'utf8mb4',
        comment: '任务流转范围',
        name: 'range',
    })
    range: string[];

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createDate',
        comment: '流程节点建时间',
    })
    createDate: Date;

    @ManyToOne(() => User, user => user.flows)
    @JoinColumn()
    belong: User;

    @OneToMany(() => Task, task => task.flow)
    tasks: Task[];

}
