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
    ) { }

    async taskAdd(body: TaskAddDTO, request: any): Promise<any> {
        try {
            const { name, detail, groupId } = body;
            const task = new Task();
            task.name = name;
            task.detail = detail;
            task.number = generate8Code(8);
            task.owner = await this.userRepository.findOne(request.user.userId);
            task.group = await this.groupRepository.findOne(groupId);
            const doc = await this.taskRepository.save(task);
            return {
                code: 10000,
                data: doc,
                msg: '任务添加成功'
            }
        } catch (err) {
            return {
                code: 9999,
                msg: err
            }
        }
    }

    /**
     * 切换任务状态
     * @param id 
     * @param status 
     */
    async changeStatus(body: any): Promise<any> {
        try {
            const { id, status } = body;
            const doc = await this.taskRepository.update(id, {
                status: status
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success'
            }
        } catch (err) {
            return {
                code: 9999,
                msg: err
            }
        }
    }

    /**
     * 删除任务
     * @param id 
     * @param status 
     */
    async delete(id: number): Promise<any> {
        try {
            const doc = await this.taskRepository.update(id, {
                status: 5
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success'
            }
        } catch (err) {
            return {
                code: 9999,
                msg: err
            }
        }
    }

    /**
     * 查询任务详情
     * @param id 
     */
    async detail(id: number): Promise<any> {
        try {
            const doc = await this.taskRepository.findOne(id, {
                relations: ['principal', 'project', 'type', 'tags']
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success'
            }
        } catch (err) {
            return {
                code: 9999,
                msg: err
            }
        }
    }

    /**
     * 分页查询已删除的任务
     * @param id 
     */
    async deleteList(body: any): Promise<any> {
        try {
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
                code: 10000,
                data: {
                    list: doc,
                    total: count
                },
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }
    /**
     * 查询某一分组下的任务列表
     * @param groupId
     */
    async list(groupId: number): Promise<any> {
        try {
            const doc = await this.taskRepository.createQueryBuilder('task')
                .where('task.groupId = :id', { groupId })
                .setParameter("id", groupId)
                // .leftJoinAndSelect('task.principal', 'principal')
                // .select(`
                // principal.avatar as avatar
                // `)
                .getMany()
            return {
                code: 10000,
                data: doc,
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }
    /**
     * 查询所有任务分组列表
     * @param id 
     */
    async groupList(name: string): Promise<any> {
        try {
            const doc = await this.groupRepository.find({
                where: {
                    'name': Like(`%${name}%`),
                },
                // relations: ['tasks'],
                cache: true,
                order: {
                    createDate: 'DESC'
                },
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }
}
