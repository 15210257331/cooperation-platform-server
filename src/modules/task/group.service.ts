import { Task } from './../../common/entity/task.entity';
import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { GroupAddDTO } from './dto/group-add.dto';
import { SubItem } from '../../common/entity/sub-item.entity';
import { GroupUpdateDTO } from './dto/group-update.dto';
import { Message } from '../../common/entity/message.entity';
import { EmailService } from "../email/email.service"

@Injectable()
export class GroupService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        private readonly emailService: EmailService
    ) { }

    /**
     * 查询当前登录用户的分组列表
     * @param id 
     */
    async list(groupName: string, request: any): Promise<any> {
        const doc = await this.groupRepository.createQueryBuilder("group")
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("user.id")
                    .from(User, "user")
                    .where("user.id = :id")
                    .getQuery();
                return "group.creator= " + subQuery;
            })
            .andWhere('group.name like "%' + groupName + '%"')
            .setParameter("id", request.user.userId)
            .leftJoinAndSelect('group.tasks', 'tasks')
            .leftJoinAndSelect('tasks.subItems', 'subItems')
            .getMany();
        return {
            data: doc,
        };
    }

    // 添加分组
    async add(groupAddDTO: GroupAddDTO, request: any): Promise<any> {
        const { name } = groupAddDTO;
        const group = new Group();
        group.name = name;
        group.creator = await this.userRepository.findOne(request.user.userId);
        group.tasks = [];
        const doc = await this.groupRepository.save(group);
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
                            新创建了一个新分组:
                            <b style="color:black;">${name}</b>
        `;
        await this.messageRepository.save(message)
        this.emailService.sendEmail();
        return {
            data: doc,
        }
    }

    // 更新分组
    async update(groupUpdateDTO: GroupUpdateDTO): Promise<any> {
        const { groupId, name } = groupUpdateDTO;
        await this.groupRepository.update(groupId, {
            name: name
        });
        const doc = await this.groupRepository.findOne(groupId);
        return {
            data: doc
        }
    }

    // 删除分组
    async delete(id: number | string, maneger: EntityManager): Promise<any> {
        const group = await this.groupRepository.findOne(id);
        // 如果该分组下的任务不为空则不允许删除
        const tasks = await maneger.find(Task, { group: group });
        if (tasks.length > 0) {
            return {
                code: 9999,
                data: '该分组下存在任务，请先删除该分组下的任务',
                message: '该分组任务不为空，无法删除'
            }
        }
        // 删除分组数据
        const doc = await maneger.delete(Group, id);
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

        const doc = await this.groupRepository.findOne(groupId, {
            relations: ["creator", "tasks"]
        })
        return {
            data: doc,
        };
    }



}
