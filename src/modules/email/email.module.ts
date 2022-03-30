import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { resolve } from "path";
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: "smtp.163.com",
                    port: "465",
                    auth: {
                        user: "15210257331@163.com",
                        pass: configService.get('EMAIL_PASS')
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
