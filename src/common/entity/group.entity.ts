import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        charset: 'utf8mb4',
        unique: false,
        name: 'name',
        comment: '分组名称',
    })
    name: string;


    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createDate',
        comment: '分组创建时间',
    })
    createDate: Date;

    /**
     * 创建该分组的用户
    * 分组和用户是多对一的关系
    * ManyToOne 可以省略JoinColumn装饰器
    * 拥有ManyToOne装饰器的表会生成外键
    * 外键默认名称是 字段名+关联的表的主键名
    * 如果不特殊指定那这里的外键是 creatorId
    */
    @ManyToOne(() => User, user => user.groups)
    @JoinColumn()
    creator: User;

    /**
    * 分组和任务是一对多的关系
    * 一个分组可以包含多个任务
    *  */
    // @OneToMany(() => Task, task => task.group)
    // tasks: Task[];

}
