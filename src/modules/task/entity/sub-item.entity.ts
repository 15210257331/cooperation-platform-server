import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Task } from './task.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class SubItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        unique: false,
        charset: 'utf8mb4',
        name: 'name',
        comment: '任务子项名称',
    })
    name: string;

    @Column({
        type: 'bool',
        name: 'complete',
        nullable: false,
        default: false,
        comment: '子任务是否已完成'
    })
    complete: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createDate',
        comment: '任务子项创建时间',
    })
    createDate: Date;


    @ManyToOne(() => Task, task => task.subItems)
    @JoinColumn()
    belong: Task;


}
