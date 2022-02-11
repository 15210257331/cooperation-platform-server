import { map } from 'rxjs/operators';
import { SubItem } from './../../common/entity/sub-item.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generate8Code } from '../../utils/utils';
import { User } from '../../common/entity/user.entity';
import { Task } from '../../common/entity/task.entity';
import { MessageDetail } from '../../common/entity/message-detail.entity';
import { Message } from '../../common/entity/message.entity'
import * as dayjs from 'dayjs'
import { Note } from '../../common/entity/note.entity';
import { Picture } from '../../common/entity/picture.entity';
import { Flow } from '../../common/entity/flow.entity';
import { MessageService } from '../message/message.service';
@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
        @InjectRepository(SubItem) private readonly subItemRepository: Repository<SubItem>,
        @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
        @InjectRepository(MessageDetail) private readonly MessageDetailRepository: Repository<MessageDetail>,
        @InjectRepository(Message) private readonly MessageRepository: Repository<Message>,
        @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
        private readonly messageService: MessageService,
    ) { }


    // 查询当前用户的所有任务
    async list(keywords: string = '', request: any): Promise<any> {
        const doc = await this.taskRepository.createQueryBuilder("task")
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("user.id")
                    .from(User, "user")
                    .where("user.id = :id")
                    .getQuery();
                return "task.owner= " + subQuery;
            })
            // .andWhere('task.name like "%' + keywords + '%"')
            .setParameter("id", request.user.userId)
            .leftJoinAndSelect('task.flow', 'flow')
            .leftJoinAndSelect('task.subItems', 'subItems')
            .leftJoinAndSelect('task.pictures', 'pictures')
            .leftJoinAndSelect('task.notes', 'notes')
            .getMany();
        return {
            data: doc,
        };
    }

    /**
     * 添加任务
     * @param body 
     * @param request 
     * @returns 
     */
    async taskAdd(taskAddDTO: TaskAddDTO, request: any): Promise<any> {
        const { name, detail, flowId, priority, reminder, startDate, endDate } = taskAddDTO;
        const task = new Task();
        task.name = name;
        task.detail = detail;
        task.priority = priority;
        task.reminder = reminder;
        task.startDate = startDate;
        task.endDate = endDate;
        task.flow = await this.flowRepository.findOne(flowId);
        task.notes = [];
        task.subItems = [];
        task.pictures = [];
        task.owner = await this.userRepository.findOne(request.user.userId);
        const doc = await this.taskRepository.save(task);
        const content =  `在流程【${task.flow.name}】下创建了一个新任务:<b style="color:black;">${name}</b>`
        this.messageService.addMessage(request.user.userId, '新建任务', content);
        return {
            data: doc,
        }
    }

    /**
     * 查询任务详情
     * @param id 
     */
    async detail(taskId: number): Promise<any> {
        const doc = await this.taskRepository.findOne(taskId, {
            relations: ['owner', 'subItems', "notes", "pictures"]
        });
        return {
            data: doc,
        }
    }

    /**
     * 任务更新单一属性
     * @param body 
     * @returns 
     */
    async updateProps(body: any): Promise<any> {
        const { taskId, propName, propValue } = body;
        const task = await this.taskRepository.findOne(taskId, {
            relations: ["subItems", "pictures", "notes"],
        });
        if (propName === 'flow') {
            const flow = await this.flowRepository.findOne(propValue);
            task.flow = flow;
        } else {
            task[propName] = propValue;
        }
        const doc = await this.taskRepository.save(task);
        return {
            data: doc,
        }
    }

    // 添加子任务
    async addChildTask(body: any): Promise<any> {
        const { taskId, subItemname } = body;
        const task = await this.taskRepository.findOne(taskId);
        const subItem = new SubItem();
        subItem.name = subItemname;
        subItem.belong = task;
        const doc = await this.subItemRepository.save(subItem);
        return {
            data: doc,
        }
    }

    // 删除子任务
    async deleteChildTask(id: number): Promise<any> {
        const doc = await this.subItemRepository.delete(id);
        return {
            data: doc,
        }
    }

    // 完成子任务
    async completeSub(body: any): Promise<any> {
        const { subId } = body;
        let subItem = await this.subItemRepository.findOne(subId);
        subItem.complete = true;
        const doc = await this.subItemRepository.save(subItem);
        return {
            data: doc,
        }
    }

    // 添加图片
    async addPicture(body: any): Promise<any> {
        const { taskId, url, name, size } = body;
        const task = await this.taskRepository.findOne(taskId);
        const picture = new Picture();
        picture.name = name;
        picture.url = url;
        picture.size = size;
        picture.belong = task;
        const doc = await this.pictureRepository.save(picture);
        return {
            data: doc,
        }
    }

    // 删除子任务
    async deletePicture(id: number): Promise<any> {
        const doc = await this.pictureRepository.delete(id);
        return {
            data: doc,
        }
    }

    // 关联笔记
    async linkNote(body: any): Promise<any> {
        const { taskId, noteId } = body;
        const task = await this.taskRepository.findOne(taskId);
        const note = await this.noteRepository.findOne(noteId);
        note.belong = task
        const doc = await this.noteRepository.save(note);
        return {
            data: doc,
        }
    }

    // 删除笔记
    async deleteNote(id: number): Promise<any> {
        const note = await this.noteRepository.findOne(id);
        note.belong = null;
        const doc = await this.noteRepository.save(note);
        return {
            data: doc,
        }
    }


    //删除任务
    async delete(id: number, maneger: EntityManager): Promise<any> {
        const task = await this.taskRepository.findOne(id, {
            relations: ['subItems', "notes", "pictures"]
        });
        // 解除关联的笔记
        task.notes = [];
        await this.taskRepository.save(task);
        // 删除该任务下的子任务
        const subItemIds = task.subItems.map(item => item.id);
        if (subItemIds.length > 0) {
            await this.subItemRepository.delete(subItemIds);
        }
        // 删除该任务下的图片
        const pictureIds = task.pictures.map(item => item.id);
        if (pictureIds.length > 0) {
            await this.pictureRepository.delete(pictureIds);
        }
        const doc = await this.taskRepository.delete(id);
        return {
            data: doc,
        }
    }



    // 近14天任务完成情况
    async trend(): Promise<any> {
        // const doc = await this.userRepository.find({
        //     relations: ["groups", "groups.tasks"],
        //     take: 7
        // });
        const data = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14].reverse().map((item) => {
            return {
                date: dayjs().subtract(item, 'day').format('MM.DD') + '日',
                total: Math.floor(Math.random() * 101)
            }
        })
        return {data}
    }

    /**
     * 分页查询已删除的任务
     * @param id 
     */
    async deleteList(body: any): Promise<any> {
        const { name, page, size } = body;
        const [doc, count] = await this.taskRepository.findAndCount({
            // where: {
            //     'status': 5,
            // },
            relations: ['principal'],
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
                total: count
            },
        };
    }


}
