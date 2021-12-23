import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('邮件')
@Controller('email')
export class EmailController {
    
    constructor(private readonly emailService: EmailService) {}

    @Get()
    sendEmail() {
        this.emailService.sendEmail();
        return 'ok';
    }
}

