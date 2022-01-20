import { Injectable, Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../common/entity/message.entity';
import { MessageDetail } from '../../common/entity/message-detail.entity';
import { EventsGateway } from '../socket/events.gateway';
import { User } from '../../common/entity/user.entity';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(MessageDetail) private readonly messageDetailRepository: Repository<MessageDetail>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly eventsGateway: EventsGateway,
    ) { }

    // 消息
    async list(request: any): Promise<any> {
        const doc = await this.messageRepository.createQueryBuilder("message")
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("user.id")
                    .from(User, "user")
                    .where("user.id = :id")
                    .getQuery();
                return "message.belong= " + subQuery;
            })
            .setParameter("id", request.user.userId)
            .leftJoinAndSelect('message.detail', 'detail')
            .take(30)
            .orderBy('message.sendDate', 'DESC')
            .getMany();
        return {
            data: doc,
        };
    }

    // 添加消息通知
    async addMessage(id: number, title: string, content: string) {
        const users = await this.userRepository.find();
        const user = users.find(item => item.id === id);
        const messageDetail = new MessageDetail();
        messageDetail.title = title;
        messageDetail.avatar = user.avatar;
        messageDetail.content = `<b>${user.nickname}</b>新创建了一个新流程:<b style="color:black;">${content}</b>`;
        const messageDetailDoc = await this.messageDetailRepository.save(messageDetail);
        const messages = users.map(user => {
            const message = new Message();
            message.read = false;
            message.detail = messageDetailDoc;
            message.belong = user;
            return message;
        })
        const messageDoc = await this.messageRepository.save(messages);
        this.eventsGateway.broadcastMessage('您有一条新的消息通知！');
        return {
            data: messageDoc,
        }
    }

    // 消息标记已读
    async read(body: { ids: number[] },): Promise<any> {
        const { ids } = body;
        const doc = await this.messageRepository.update(ids, {
            read: true,
        })
        return {
            data: doc
        }
    }


}