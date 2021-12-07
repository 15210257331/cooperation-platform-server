import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { Task } from 'src/common/entity/task.entity';
import { GroupAddDTO } from './dto/group-add.dto';

@Injectable()
export class GroupService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
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
        return {
            data: doc,
        }
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
