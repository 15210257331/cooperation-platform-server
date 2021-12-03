import { map } from 'rxjs/operators';
import { SubItem } from './../../common/entity/sub-item.entity';
import { group } from 'console';
import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { Like, Repository } from 'typeorm';
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
        const { name, detail, groupId, priority, reminder, reminderDate, workload, startDate, endDate, pictures, subItems } = body;
        const task = new Task();
        task.name = name;
        task.detail = detail;
        task.priority = priority;
        task.reminder = reminder;
        task.reminderDate = reminderDate;
        task.workload = workload;
        task.startDate = startDate;
        task.endDate = endDate;
        task.pictures = pictures;
        task.group = await this.groupRepository.findOne(groupId);
        let arr = [];
        if (subItems) {
            subItems.split(',').map(item => {
                const subItem = new SubItem();
                subItem.name = item;
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

    /**
     * 删除任务
     * @param id 
     * @param status 
     */
    async delete(id: number): Promise<any> {
        const doc = await this.taskRepository.update(id, {
            status: 5
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

    // 任务数量排行榜
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
