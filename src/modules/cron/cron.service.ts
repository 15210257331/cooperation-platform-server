import { Injectable, Module } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Task } from '../../common/entity/task.entity';
import { EventsGateway } from '../../utils/events.gateway';
import * as dayjs from 'dayjs'
import { EmailService } from "../email/email.service"

const randomQuoteApi = 'http://api.quotable.io/random';


@Injectable()
export class CronService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        private readonly eventsGateway: EventsGateway,
        private readonly emailService: EmailService
    ) { }

    /**
     * Cron 装饰器装饰的方法会自动调用
     * 每分钟执行一次 遍历设置提醒的任务 在截止时间之前推送消息 
     * */
    // @Cron('5 * * * * *')
    @Interval(10000)
    async handleCron() {
        // 筛选进行中并且设置了提醒的任务全部任务
        const remindTasks = await this.taskRepository.find({
            where: {
                status: 2,
                reminder: Not(99)
            },
            select: ['name', "endDate", "reminder"],
            relations: ["owner"]
        });
        const now = dayjs().format("YYYY-MM-DD HH:mm");
        remindTasks.map(task => {
            const reminderTime = this.calculateReminderTime(task);
            if (reminderTime == now) {
                const endDate = dayjs(task.endDate).format("YYYY-MM-DD HH:mm");
                const userId = task.owner.id;
                const body = `<p>任务<b style="color:black;font-weight:600">【${task.name}】</b>将于<span style="color:red;">${endDate}</span>截止!</p>`
                this.eventsGateway.sendMessage(userId, body);
            }
        })
    }

    // @Cron('5 * * * * *')
    // sendEmail() {
    //     console.log('发送邮件');
    //     this.emailService.sendEmail('993865015@qq.com');
    // }

    // 计算任务提醒时间
    calculateReminderTime(task: any) {
        let reminderTime;
        if (task.reminder === 1) {
            // 截止前10分钟
            reminderTime = dayjs(task.endDate).subtract(10, 'minute');
        } else if (task.reminder === 2) {
            // 截止前一小时
            reminderTime = dayjs(task.endDate).subtract(1, 'hour');
        } else if (task.reminder === 2) {
            // 截止前两小时
            reminderTime = dayjs(task.endDate).subtract(2, 'hour');
        } else if (task.reminder === 2) {
            // 截止前一天
            reminderTime = dayjs(task.endDate).subtract(1, 'day');
        }
        return reminderTime.format("YYYY-MM-DD HH:mm");
    }

}