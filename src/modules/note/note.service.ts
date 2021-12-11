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
        note.overview = noteAddDTO.overview;
        note.owner = await this.userRepository.findOne(request.user.userId);
        const doc = await this.noteRepository.save(note);
        return {
            data: doc,
        };
    }

    async list(body: any): Promise<any> {
        const { keywords, page, size } = body;
        const [doc, total] = await this.noteRepository.findAndCount({
            where: [
                {
                    'title': Like(`%${keywords}%`),
                },
                {
                    'overview': Like(`%${keywords}%`),
                }
            ],
            relations: ["owner"],
            cache: true,
            order: {
                createDate: 'DESC'
            },
            skip: (page - 1) * size,
            take: size,
        });
        return {
            data: {
                list: doc,
                total: total
            },
        };
    }

    async delete(id: number | string): Promise<any> {
        const doc = await this.noteRepository.delete(id)
        return {
            data: doc,
        };
    }

    // 笔记详情
    async detail(noteId: number): Promise<any> {
        // const doc = await this.taskRepository.createQueryBuilder('task')
        //     .where('task.groupId = :id', { groupId })
        //     .setParameter("id", groupId)
        // .leftJoinAndSelect('task.principal', 'principal')
        // .select(`
        // principal.avatar as avatar
        // `)
        // .getMany()

        const doc = await this.noteRepository.findOne(noteId, {
            relations: ["owner",]
        })
        return {
            data: doc,
        };
    }

}
