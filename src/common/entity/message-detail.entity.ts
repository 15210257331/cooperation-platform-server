import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MessageDetail {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        comment: '标题',
        type: 'varchar',
        name: 'title',
        charset: 'utf8mb4',
    })
    title: string;

    @Column({
        comment: '头像',
        type: 'varchar',
        name: 'avatar',
    })
    avatar: string;

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

}
