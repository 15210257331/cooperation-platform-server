import { Task } from './../../common/entity/task.entity';
import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { GroupAddDTO } from './dto/group-add.dto';
import { GroupUpdateDTO } from './dto/group-update.dto';
import { Message } from '../../common/entity/message.entity';
import { Flow } from '../../common/entity/flow.entity';
import { FlowAddDTO } from './dto/flow-add.dto';
import { FlowUpdateDTO } from './dto/flow-update.dto';
@Injectable()
export class FlowService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    ) { }

    /**
     * 查询当前登录用户的流程列表
     * @param id 
     */
    async list(request: any): Promise<any> {
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
        const doc = flows.map(item => {
            return Object.assign(item, {
                total: item.tasks.length
            })
        })
        return {
            data: doc,
        };
    }

    // 添加节点
    async add(flowAddDTO: FlowAddDTO, request: any): Promise<any> {
        const { name, sort, range } = flowAddDTO;
        const flow = new Flow();
        flow.name = name;
        flow.sort = sort;
        flow.range = range;
        flow.belong = await this.userRepository.findOne(request.user.userId);
        flow.tasks = [];
        const doc = await this.flowRepository.save(flow);
        // 消息通知相关
        const user = await this.userRepository.findOne({
            where: {
                id: request.user.userId
            },
            select: ["nickname",]

        });
        const message = new Message();
        message.content = `
                            <b>${user.nickname}</b>
                            新创建了一个新流程:
                            <b style="color:black;">${name}</b>
        `;
        await this.messageRepository.save(message)
        return {
            data: doc,
        }
    }

    // 更新节点
    async update(flowUpdateDTO: FlowUpdateDTO): Promise<any> {
        const { id, name, sort, range, canNew } = flowUpdateDTO;
        await this.flowRepository.update(id, {
            name: name,
            range: range,
            canNew: canNew,
            sort: sort,
        });
        const doc = await this.flowRepository.findOne(id, {
            relations: ["tasks", "tasks.subItems", "tasks.notes", "tasks.pictures"]
        });
        return {
            data: doc
        }
    }

    // 删除节点
    async delete(id: number, maneger: EntityManager): Promise<any> {
        const flow = await this.flowRepository.findOne(id);
        // 如果该分组下的任务不为空则不允许删除
        const tasks = await maneger.find(Task, { flow: flow });
        if (tasks.length > 0) {
            return {
                code: 9999,
                data: '该分组下存在任务，请先删除该分组下的任务',
                message: '该分组任务不为空，无法删除'
            }
        }
        // 删除分组数据
        const doc = await maneger.delete(Flow, id);
        return {
            data: doc,
        };
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

        const doc = await this.flowRepository.findOne(groupId, {
            relations: ["creator", "tasks"]
        })
        return {
            data: doc,
        };
    }



}
