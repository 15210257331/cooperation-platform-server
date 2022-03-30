import { Task } from './entity/task.entity';
import { HttpException, Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { MessageDetail } from '../message/entity/message-detail.entity';
import { Flow } from './entity/flow.entity';
import { FlowAddDTO } from './dto/flow-add.dto';
import { FlowUpdateDTO } from './dto/flow-update.dto';
import { Message } from '../message/entity/message.entity';
import { MessageService } from '../message/message.service';
@Injectable()
export class FlowService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(MessageDetail) private readonly messageDetailRepository: Repository<MessageDetail>,
        private readonly messageService: MessageService,
    ) { }

    /**
     * 查询当前登录用户的流程列表
     */
    async list(keywords: string, request: any): Promise<any> {
        const flows = await this.flowRepository.createQueryBuilder("flow")
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("user.id")
                    .from(User, "user")
                    .where("user.id = :id")
                    .getQuery();
                return "flow.belong= " + subQuery;
            })
            .setParameter("id", request.user.userId)
            .leftJoinAndSelect('flow.tasks', 'tasks')
            .leftJoinAndSelect('tasks.subItems', 'subItems')
            .leftJoinAndSelect('tasks.pictures', 'pictures')
            .leftJoinAndSelect('tasks.notes', 'notes')
            .getMany();
        return flows.map(item => {
            let tasks = item.tasks;
            if (keywords) {
                tasks = item.tasks.filter(item => item.name.includes(keywords));
            }
            return Object.assign(item, {
                tasks: tasks
            })
        })
    }

    async all(request: any): Promise<any> {
        return await this.flowRepository.createQueryBuilder("flow")
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("user.id")
                    .from(User, "user")
                    .where("user.id = :id")
                    .getQuery();
                return "flow.belong= " + subQuery;
            })
            .setParameter("id", request.user.userId)
            .getMany();
    }

    // 添加节点
    async add(flowAddDTO: FlowAddDTO, request: any): Promise<any> {
        const { name, sort, range, complete } = flowAddDTO;
        const flow = new Flow();
        flow.name = name;
        flow.sort = sort;
        flow.range = range;
        flow.complete = complete;
        flow.belong = await this.userRepository.findOne(request.user.userId);
        flow.tasks = [];
        const doc = await this.flowRepository.save(flow);
        // 消息通知
        const content = `新创建了一个流程: <b style="color:black;">${name}</b>`
        this.messageService.addMessage(request.user.userId, '新建流程', content);
        return doc
    }

    // 更新节点
    async update(flowUpdateDTO: FlowUpdateDTO): Promise<any> {
        const { id, name, sort, range, canNew, complete } = flowUpdateDTO;
        await this.flowRepository.update(id, {
            name: name,
            range: range,
            canNew: canNew,
            sort: sort,
            complete: complete,
        });
        const doc = await this.flowRepository.findOne(id, {
            relations: ["tasks", "tasks.subItems", "tasks.notes", "tasks.pictures"]
        });
        return doc;
    }

    // 删除节点
    async delete(id: number, maneger: EntityManager): Promise<any> {
        const flow = await this.flowRepository.findOne(id);
        // 如果该分组下的任务不为空则不允许删除
        const tasks = await maneger.find(Task, { flow: flow });
        if (tasks.length > 0) {
            throw new HttpException('该分组任务不为空，无法删除', 200)
        }
        // 删除分组数据
        return await maneger.delete(Flow, id);
    }


    /**
     * 查询分组详情
     * @param groupId
     */
    async detail(groupId: number): Promise<any> {
        // const doc = await this.taskRepository.createQueryBuilder('task')
        //     .where('task.groupId = :id', { groupId })
        //     .setParameter("id", groupId)
        // .leftJoinAndSelect('task.principal', 'principal')
        // .select(`
        // principal.avatar as avatar
        // `)
        // .getMany()

        return await this.flowRepository.findOne(groupId, {
            relations: ["creator", "tasks"]
        })
    }
}
