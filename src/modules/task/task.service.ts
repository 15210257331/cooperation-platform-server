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

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(SubItem) private readonly subItemRepository: Repository<SubItem>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    ) { }

    /**
     * 添加任务
     * @param body 
     * @param request 
     * @returns 
     */
    async taskAdd(body: TaskAddDTO, request: any): Promise<any> {
        const { name, detail, groupId, priority, reminder, workload, startDate, endDate, pictures, subItems } = body;
        const task = new Task();
        task.name = name;
        task.detail = detail;
        task.priority = priority;
        task.reminder = reminder;
        task.workload = workload;
        task.startDate = startDate;
        task.endDate = endDate;
        task.pictures = pictures;
        task.group = await this.groupRepository.findOne(groupId);
        let arr = [];
        console.log(123123123123);
        if (subItems) {
            (JSON.parse(subItems) || []).map(item => {
                const subItem = new SubItem();
                subItem.name = item.name;
                subItem.status = item.status
                arr.push(subItem);
            })
            await this.subItemRepository.save(arr);
        }
        console.log(123123123123);
        task.subItems = arr;
        const doc = await this.taskRepository.save(task);
        // 消息通知相关
        const user = await this.userRepository.findOne({
            where: {
                id: request.user.userId
            },
            select: ["nickname",]

        });
        const message = new Message();
        message.content = `${user.nickname}在分组${task.group.name}下创建了一个新任务:${name}`
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
            relations: ['owner', 'group', 'subItems']
        });
        return {
            data: doc,
        }
    }

    /**
     * 切换任务状态
     * @param id 
     * @param status 
     */
    async changeStatus(body: any): Promise<any> {
        const { id, status } = body;
        const doc = await this.taskRepository.update(id, {
            status: status
        });
        return {
            data: doc,
        }
    }

    // 更新任务
    async update(body: any): Promise<any> {
        const { id, name, detail, startDate, endDate, priority, reminder, workload, pictures, subItems } = body;
        const doc = await this.taskRepository.update(id, {
            name: name,
            detail: detail,
            startDate: startDate,
            endDate: endDate,
            priority: priority,
            reminder: reminder,
            workload: workload,
            pictures: pictures,
        });
        return {
            data: doc,
        }
    }

    /**
     * 删除任务
     * @param id 
     * @param status 
     */
    async delete(body: any, maneger: EntityManager): Promise<any> {
        const { taskId, subItemId } = body;
        // const task = this.taskRepository.findOne(taskId);
        // // 删除关联的subItem
        // await maneger.delete(SubItem, { belong: task })
        const subItemIds = subItemId.split(',');
        if (subItemIds.length > 0) {
            await this.subItemRepository.delete(subItemIds);
        }
        const doc = await this.taskRepository.delete(taskId);
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
