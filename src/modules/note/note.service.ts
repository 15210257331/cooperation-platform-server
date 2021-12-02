import { User } from './../../common/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../../common/entity/note.entity';
import { Like, Repository } from 'typeorm';
import { NoteAddDTO } from './dto/note-add.dto';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async add(noteAddDTO: NoteAddDTO, request: any): Promise<any> {
        const note = new Note();
        note.title = noteAddDTO.title;
        note.content = noteAddDTO.content;
        note.owner = await this.userRepository.findOne(request.user.userId);
        const doc = await this.noteRepository.insert(note);
        return {
            data: doc,
        };
    }

    async list(keywords: string): Promise<any> {
        const doc = await this.noteRepository.find({
            where: {
                'title': Like(`%${keywords}%`),
            },
            relations: ["owner"],
            cache: true,
            order: {
                createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
            },
        });
        return {
            data: doc,
        };
    }

    async delete(id: number | string): Promise<any> {
        try {
            const doc = await this.noteRepository.delete(id)
            return {
                code: 10000,
                data: doc,
                msg: 'Success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

}
