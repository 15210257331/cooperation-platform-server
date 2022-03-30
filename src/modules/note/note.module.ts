import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Note } from './entity/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MessageDetail } from '../message/entity/message-detail.entity';
import { MessageModule } from '../message/message.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Note,User]),
    MessageModule
  ],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService]
})
export class NoteModule {}
