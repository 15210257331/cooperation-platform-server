import { Task } from 'src/common/entity/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        comment: '标题',
        type: 'varchar',
        nullable: false,
        length: 50,
        charset: 'utf8mb4',
        name: 'title',
    })
    title: string;

    @Column({
        comment: '概览',
        type: 'text',
        nullable: true,
        charset: 'utf8mb4',
        name: 'overview',
    })
    overview: string;

    @Column({
        comment: '封面',
        type: 'varchar',
        nullable: true,
        name: 'cover',
    })
    cover: string;

    @Column({
        comment: '发布状态',
        type: 'bool',
        nullable: true,
        default: () => true,
        name: 'publish',
    })
    publish: boolean;

    @Column({
        comment: '内容',
        type: 'text',
        name: 'content',
        charset: 'utf8mb4',
    })
    content: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'createDate',
        comment: '创建时间',
    })
    createDate: Date;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'publishDate',
        comment: '发布时间',
    })
    publishDate: Date;

    // 关联到哪个任务
    @ManyToOne(() => Task, task => task.notes)
    @JoinColumn()
    belong: Task;

    // 创建人
    @ManyToOne(() => User, user => user.notes)
    @JoinColumn()
    owner: User;
}
