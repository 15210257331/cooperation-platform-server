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

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(SubItem) private readonly subItemRepository: Repository<SubItem>,
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
        if (subItems) {
            (JSON.parse(subItems) || []).map(item => {
                const subItem = new SubItem();
                subItem.name = item;
                subItem.status = item.status
                arr.push(subItem);
            })
            await this.subItemRepository.save(arr);
        }
        task.subItems = arr;
        const doc = await this.taskRepository.save(task);
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
            status: 5
        });
        return {
            data: doc,
        }
    }

    // 消息
    async message(): Promise<any> {
        return {
            data: [
                {
                    content: '陈晓飞刚刚创建了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: 'admin刚刚完成了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: '陈晓飞刚刚创建了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: 'admin刚刚完成了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: '陈晓飞刚刚创建了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: 'admin刚刚完成了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: '陈晓飞刚刚创建了一个任务',
                    date: new Date().toLocaleDateString(),
                },
                {
                    content: 'admin刚刚完成了一个任务',
                    date: new Date().toLocaleDateString(),
                }
            ],
        }
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
