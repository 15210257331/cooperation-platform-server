import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { MessageDetail } from './message-detail.entity';
import { User } from '../../user/entity/user.entity';

// 用户消息表 储存用户的消息

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        comment: '是否已读',
        type: 'bool',
        name: 'read',
    })
    read: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'sendDate',
        comment: '发送时间',
    })
    sendDate: Date;

    @ManyToOne(() => MessageDetail)
    @JoinColumn()
    detail: MessageDetail;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn()
    belong: User;

}
