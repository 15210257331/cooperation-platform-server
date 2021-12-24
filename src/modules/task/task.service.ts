import { map } from 'rxjs/operators';
import { SubItem } from './../../common/entity/sub-item.entity';
import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generate8Code } from '../../utils/utils';
import { User } from '../../common/entity/user.entity';
import { Task } from '../../common/entity/task.entity';
import { Message } from '../../common/entity/message.entity';
import * as dayjs from 'dayjs'
import { Note } from '../../common/entity/note.entity';
import { Picture } from '../../common/entity/picture.entity';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(SubItem) private readonly subItemRepository: Repository<SubItem>,
        @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    ) { }

    /**
     * 添加任务
     * @param body 
     * @param request 
     * @returns 
     */
    async taskAdd(body: TaskAddDTO, request: any): Promise<any> {
        const { name, detail, groupId, priority, reminder, workload, startDate, endDate } = body;
        const task = new Task();
        task.name = name;
        task.detail = detail;
        task.priority = priority;
        task.reminder = reminder;
        task.workload = workload;
        task.startDate = startDate;
        task.endDate = endDate;
        task.group = await this.groupRepository.findOne(groupId);
        task.notes = [];
        task.subItems = [];
        task.pictures = [];
        task.owner = await this.userRepository.findOne(request.user.userId);
        const doc = await this.taskRepository.save(task);
        // 消息通知相关
        const user = await this.userRepository.findOne({
            where: {
                id: request.user.userId
            },
            select: ["nickname",]

        });
        const message = new Message();
        message.content = `<b>${user.nickname}</b>
                             在分组【${task.group.name}】下创建了一个新任务:
                            <b style="color:black;">${name}</b>
                           `
        await this.messageRepository.save(message)
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
            relations: ['owner', 'group', 'subItems', "notes", "pictures"]
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
            relations: ["subItems"]
        });
        task[propName] = propValue;
        const doc = await this.taskRepository.save(task);
        return {
            data: task,
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
        const doc = await this.subItemRepository.update(subId, {
            status: 2
        });
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

    // 删除子任务
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
        await this.subItemRepository.delete(subItemIds);
        // 删除该任务下的图片
        const pictureIds = task.pictures.map(item => item.id);
        await this.pictureRepository.delete(pictureIds);
        const doc = await this.taskRepository.delete(id);
        return {
            data: doc,
        }
    }



    // 任务数量排行榜
    async rank(): Promise<any> {
        const doc = await this.userRepository.find({
            relations: ["groups", "groups.tasks"],
            take: 7
        });
        const data = doc.map(item => {
            let taskNum = 0;
            item.groups.map(item => {
                taskNum += item.tasks.length;
            })
            return {
                nickname: item.nickname,
                groupNum: item.groups.length,
                taskNum: taskNum
            }
        })
        return {
            data: data,
        }
    }

    // 近14天任务完成情况
    async trend(): Promise<any> {
        const doc = await this.userRepository.find({
            relations: ["groups", "groups.tasks"],
            take: 7
        });
        const data = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14].reverse().map((item) => {
            return {
                date: dayjs().subtract(item, 'day').format('MM.DD') + '日',
                total: Math.floor(Math.random() * 101)
            }
        })
        return {
            data: data,
        }
    }

    // 消息
    async message(): Promise<any> {
        const doc = await this.messageRepository.find({
            order: {
                createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
            },
            take: 10
        })
        return {
            data: doc
        }
    }

    async addMessage(content: string): Promise<any> {
        const message = new Message();
        message.content = content;
        await this.messageRepository.save(message)
    }

    /**
     * 分页查询已删除的任务
     * @param id 
     */
    async deleteList(body: any): Promise<any> {
        const { name, page, size } = body;
        const [doc, count] = await this.taskRepository.findAndCount({
            where: {
                'status': 5,
            },
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
