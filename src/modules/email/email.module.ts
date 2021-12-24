import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { resolve } from "path";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: "smtp.163.com",
                    port: "465",
                    auth: {
                        user: "15210257331@163.com",
                        pass: "xxxxxxxx"
                    }
                },
                defaults: {
                    from: '"陈晓飞" <15210257331@163.com>'
                },
                // 配置模板出错 为啥
                // template: {
                //     dir: resolve(__dirname, './template'),
                //     adapter: new HandlebarsAdapter(),
                //     options: {
                //         strict: true
                //     }
                // }
            })
        })
    ],
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService]
})
export class EmailModule { }
