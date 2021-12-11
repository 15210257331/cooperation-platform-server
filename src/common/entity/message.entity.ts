import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        comment: '内容',
        type: 'text',
        name: 'content',
        charset: 'utf8mb4',
    })
    content: string;

    @Column({
        type: 'int',
        name: 'type',
        default: () => 1,
        comment: '消息类型 1 新建任务 2 完成任务 3 删除任务 4 新建分组 5 删除分组',
    })
    type: number;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'createDate',
        comment: '创建时间',
    })
    createDate: Date;
}
