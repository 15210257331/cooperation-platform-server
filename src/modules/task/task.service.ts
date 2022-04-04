import { SubItem } from './entity/sub-item.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Task } from './entity/task.entity';
import { Picture } from './entity/picture.entity';
import { Flow } from './entity/flow.entity';
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
        @InjectRepository(SubItem) private readonly subItemRepository: Repository<SubItem>,
        @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
        private readonly notificationService: NotificationService,
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
            .getMany();
        return doc;
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
        task.subItems = [];
        task.pictures = [];
        task.owner = await this.userRepository.findOne(request.user.userId);
        const doc = await this.taskRepository.save(task);
        const content = `在流程【${task.flow.name}】下创建了一个新任务:<b style="color:black;">${name}</b>`
        this.notificationService.addMessage(request.user.userId, '新建任务', content);
        return doc;
    }

    /**
     * 查询任务详情
     * @param id 
     */
    async detail(taskId: number): Promise<any> {
        return await this.taskRepository.findOne(taskId, {
            relations: ['owner', 'subItems', "pictures"]
        });
    }

    /**
     * 任务更新单一属性
     * @param body 
     * @returns 
     */
    async updateProps(body: any): Promise<any> {
        const { taskId, propName, propValue } = body;
        const task = await this.taskRepository.findOne(taskId, {
            relations: ["subItems", "pictures"],
        });
        if (propName === 'flow') {
            const flow = await this.flowRepository.findOne(propValue);
            task.flow = flow;
        } else {
            task[propName] = propValue;
        }
        return await this.taskRepository.save(task);
    }

    // 添加子任务
    async addChildTask(body: any): Promise<any> {
        const { taskId, subItemname } = body;
        const task = await this.taskRepository.findOne(taskId);
        const subItem = new SubItem();
        subItem.name = subItemname;
        subItem.belong = task;
        return await this.subItemRepository.save(subItem);
    }

    // 删除子任务
    async deleteChildTask(id: number): Promise<any> {
        return await this.subItemRepository.delete(id);
    }

    // 完成子任务
    async completeSub(body: any): Promise<any> {
        const { subId } = body;
        let subItem = await this.subItemRepository.findOne(subId);
        subItem.complete = true;
        return await this.subItemRepository.save(subItem);
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
        return await this.pictureRepository.save(picture);
    }

    // 删除子任务
    async deletePicture(id: number): Promise<any> {
        return await this.pictureRepository.delete(id);
    }


    //删除任务
    async delete(id: number, maneger: EntityManager): Promise<any> {
        const task = await this.taskRepository.findOne(id, {
            relations: ['subItems', "pictures"]
        });
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
        return await this.taskRepository.delete(id);
    }
}
