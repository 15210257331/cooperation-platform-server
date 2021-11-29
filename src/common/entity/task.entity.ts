import { User } from './user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { SubItem } from './sub-item.entity';
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
        comment: '任务状态 1未开始  2进行中  3已完成'
    })
    status: number;

    @Column({
        type: 'int',
        name: 'priority',
        default: 1,
        nullable: false,
        comment: '任务优先级 1 L1  2L2  3L3 4L4 5L5 6L6  依次升高'
    })
    priority: number;

    @Column({
        type: 'int',
        name: 'reminder',
        default: 0,
        nullable: false,
        comment: '是否设置提醒'
    })
    reminder: number;

    @Column({
        type: 'timestamp',
        name: 'reminderDate',
        nullable: true,
        comment: '提醒时间'
    })
    reminderDate: Date;

    @Column({
        type: 'int',
        name: 'workload',
        default: 1,
        nullable: false,
        comment: '工作量 1低  2中  3高'
    })
    workload: number;

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

    @Column({
        type: 'varchar',
        nullable: true,
        default: 'https://c-ssl.duitang.com/uploads/item/201608/02/20160802001436_CtfiH.jpeg',
        name: 'pictures',
        comment: '任务截图'
    })
    pictures: string;

    /**
     * 任务和分组是多对一的关系
     * 多个任务隶属于同一个分组
     */
     @ManyToOne(() => Group, group => group.tasks)
     @JoinColumn()
     group: Group;


     
    /**
     * 任务和任务子项是一对多的关系
     * 该任务所有的子任务
     *  */
    @OneToMany(() => SubItem, SubItem => SubItem.belong)
    subItems: Task[];

}
