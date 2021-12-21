import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
/**
 * 任务所关联的图片附件
 */
@Entity()
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        unique: false,
        charset: 'utf8mb4',
        name: 'name',
        comment: '图片名称',
    })
    name: string;

    @Column({
        type: 'int',
        nullable: false,
        unique: false,
        name: 'size',
        comment: '图片大小',
    })
    size: number;

    @Column({
        type: 'text',
        nullable: false,
        unique: false,
        charset: 'utf8mb4',
        name: 'url',
        comment: '图片地址',
    })
    url: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createDate',
        comment: '图片上传建时间',
    })
    createDate: Date;


    @ManyToOne(() => Task, task => task.pictures)
    @JoinColumn()
    belong: Task;

}
