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
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationDetail)
    private readonly notificationDetailRepository: Repository<NotificationDetail>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  // 消息
  async list(request: any, queryParams: any): Promise<any> {
    // console.log(queryParams);
    const { pageIndex, pageSize } = queryParams;
    const list = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.belongId = :id', { id: request.user.userId })
      .select('notification.id', 'id')
      .addSelect('notification.read', 'read')
      .addSelect('notification.sendDate', 'sendDate')
      .addSelect((subQuery) => {
        return subQuery
          .from(NotificationDetail, 'notificationDetail')
          .select('notificationDetail.content', 'content')
          .where('notification.detailId = notificationDetail.id');
      }, 'content')
      .addSelect((subQuery) => {
        return subQuery
          .from(NotificationDetail, 'notificationDetail')
          .select('notificationDetail.title', 'title')
          .where('notification.detailId = notificationDetail.id');
      }, 'title')
      .addSelect((subQuery) => {
        return subQuery
          .from(NotificationDetail, 'notificationDetail')
          .select('notificationDetail.avatar', 'avatar')
          .where('notification.detailId = notificationDetail.id');
      }, 'avatar')
      .take(pageSize)
      .skip((pageIndex - 1) * pageSize)
      .orderBy('notification.sendDate', 'DESC')
      .getRawMany();
    const total = await this.notificationRepository.count();
    return {
      list: list,
      total: total,
    };
  }

  /** 未读消息数量 */
  async unreadCount(request: any) {
    return this.notificationRepository.count({
      where: {
        belong: await this.userRepository.findOne(request.user.userId),
        read: false,
      },
    });
  }

  // 添加消息通知
  async addMessage(id: string, title: string, content: string) {
    const users = await this.userRepository.find();
    const user = users.find((item) => item.id === id);
    const messageDetail = new NotificationDetail();
    messageDetail.title = title;
    messageDetail.avatar = user.avatar;
    messageDetail.content = '用户【' + user.nickname + '】' + content;
    const messageDetailDoc = await this.notificationDetailRepository.save(
      messageDetail,
    );
    const messages = users.map((user) => {
      const message = new Notification();
      message.read = false;
      message.detail = messageDetailDoc;
      message.belong = user;
      return message;
    });
    const messageDoc = await this.notificationRepository.save(messages);
    this.websocketGateway.broadcastMessage('您有一条新的消息通知！');
    return messageDoc;
  }

  // 消息标记已读
  async read(body: { id: number }): Promise<any> {
    const { id } = body;
    return await this.notificationRepository.update(id, {
      read: true,
    });
  }
}
