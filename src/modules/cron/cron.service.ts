import { Injectable, Module } from '@nestjs/common';
import { Cron, Interval,CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import * as dayjs from 'dayjs';
import { WebsocketGateway } from '../websocket/websoket.gateway';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  /**
   * Cron或者Interval 装饰器装饰的方法会自动调用
   * 每10秒执行一次 遍历设置提醒的任务 在截止时间之前推送消息
   * */
  // @Cron('5 * * * * *')
  @Interval(10000)
  async handleCron() {
    // 筛选设置了提醒的任务全部任务
    const remindTasks = await this.taskRepository.find({
      where: {
        remind: Not(0),
      },
      select: ['name', 'endDate', 'remind'],
      relations: ['owner'],
    });

    const now = dayjs().format('YYYY-MM-DD HH:mm');
    if (remindTasks) {
      remindTasks.map((task) => {
        const reminderTime = this.calculateReminderTime(task);
        // console.log(reminderTime);
        if (reminderTime == now) {
          const endDate = dayjs(task.endDate).format('YYYY-MM-DD HH:mm');
          const userId = task.owner.id;
          const body = `<p>任务<b style="color:black;font-weight:600">【${task.name}】</b>将于<span style="color:red;">${endDate}</span>截止!</p>`;
          this.websocketGateway.sendMessage(userId, body);
        }
      });
    }
  }

  // 计算任务提醒时间
  calculateReminderTime(task: any) {
    let reminderTime;
    if (task.remind === 1) {
      // 截止前10分钟
      reminderTime = dayjs(task.endDate).subtract(10, 'minute');
    } else if (task.remind === 2) {
      // 截止前一小时
      reminderTime = dayjs(task.endDate).subtract(1, 'hour');
    } else if (task.remind === 3) {
      // 截止前两小时
      reminderTime = dayjs(task.endDate).subtract(2, 'hour');
    } else if (task.remind === 4) {
      // 截止前一天
      reminderTime = dayjs(task.endDate).subtract(1, 'day');
    }
    return reminderTime.format('YYYY-MM-DD HH:mm');
  }
}
