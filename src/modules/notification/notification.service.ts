import { Injectable, Module } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationDetail } from './entity/notification-detail.entity';
import { User } from '../user/entity/user.entity';
import { WebsocketGateway } from '../websocket/websoket.gateway';

@Injectable()
export class NotificationService {

    constructor(
        @InjectRepository(Notification) private readonly messageRepository: Repository<Notification>,
        @InjectRepository(NotificationDetail) private readonly messageDetailRepository: Repository<NotificationDetail>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly websocketGateway: WebsocketGateway,
    ) { }

    // 消息
    async list(request: any): Promise<any> {
        return await this.messageRepository.createQueryBuilder("message")
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
    }

    // 添加消息通知
    async addMessage(id: number, title: string, content: string) {
        const users = await this.userRepository.find();
        const user = users.find(item => item.id === id);
        const messageDetail = new NotificationDetail();
        messageDetail.title = title;
        messageDetail.avatar = user.avatar;
        messageDetail.content = '用户【' + user.nickname + '】' + content;;
        const messageDetailDoc = await this.messageDetailRepository.save(messageDetail);
        const messages = users.map(user => {
            const message = new Notification();
            message.read = false;
            message.detail = messageDetailDoc;
            message.belong = user;
            return message;
        })
        const messageDoc = await this.messageRepository.save(messages);
        this.websocketGateway.broadcastMessage('您有一条新的消息通知！');
        return messageDoc;
    }

    // 消息标记已读
    async read(body: { ids: number[] },): Promise<any> {
        const { ids } = body;
        return await this.messageRepository.update(ids, {
            read: true,
        })
    }
}