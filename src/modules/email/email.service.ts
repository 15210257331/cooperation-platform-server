import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { resolve } from "path"

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) { }

    sendEmail(targetEmail:string) {
        this.mailerService.sendMail({
            to: targetEmail, // 接收信息的邮箱
            // from: 'xxx@qq.com', // 自定义发送者的邮箱，默认在mudule已配置了，可以不配置
            subject: '这是我发的邮件', // 邮件标题
            html: `<b style="color:red">welcome !</b>`,
            // template: 'index',
        })
    }
}
