/*
 * @Author: your name
 * @Date: 2021-11-24 11:24:02
 * @LastEditTime: 2021-11-24 11:24:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /nice-todo-nest/src/modules/task/group.service.ts
 */
import { Group } from '../../common/entity/group.entity';
import { Injectable, Request, UnauthorizedException, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';

@Injectable()
export class GroupService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    ) { }

    /**
     * 查询分组列表
     * @param id 
     */
    async list(groupName: string): Promise<any> {
        const doc = await this.groupRepository.find({
            where: {
                'name': Like(`%${groupName}%`),
            },
            relations: ['tasks'],
            cache: true,
            order: {
                createDate: 'ASC'
            },
        });
        return {
            data: doc,
        };
    }

    // 添加分组
    async add(body: any, request: any): Promise<any> {
        const { name } = body;
        const group = new Group();
        group.name = name;
        group.creator = await this.userRepository.findOne(request.user.userId);
        group.tasks = [];
        const doc = await this.groupRepository.save(group);
        return {
            data: doc,
        }
    }



}
