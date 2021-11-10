import { Project } from './entity/project.entity';
import { Injectable, Request, } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { Result } from '../../interface/result.interface';
import { Task } from './entity/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generate8Code } from '../../utils/utils';
import { User } from '../../entity/user.entity';
import { Tag } from './entity/tag.entity';
import { Type } from './entity/type.entity';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Type) private readonly typeRepository: Repository<Type>,
    ) { }

    async taskAdd(body: TaskAddDTO, request: any): Promise<Result> {
        try {
            const {name, content, tags,projectId, type} = body;
            const task = new Task();
            task.name = name;
            task.content = content;
            task.number = generate8Code(8);
            task.status = 1;
            task.principal = await this.userRepository.findOne(request.user.userId);
            task.project = await this.projectRepository.findOne(projectId);
            task.tags = await this.tagRepository.findByIds(tags)
            task.type = await this.typeRepository.findOne(type)
            const doc = await this.taskRepository.save(task);
            delete doc.project;
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
     * 切换任务状态
     * @param id 
     * @param status 
     */
    async changeStatus(body:any): Promise<Result> {
        try {
            const {id, status} = body;
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
    async delete(id:number): Promise<Result> {
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
    async detail(id:number): Promise<Result> {
        try {
            const doc = await this.taskRepository.findOne(id, {
              relations: ['principal','project', 'type', 'tags']
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
     * 查询项目评论
     * @param id 
     */
    async comment(id:number): Promise<Result> {
        try {
            const doc = await this.taskRepository.findOne(id, {
              relations: ['principal','project', 'type', 'tags']
            });
            return {
                code: 10000,
                data: [],
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
    async deleteList(body:any): Promise<Result> {
        try {
            const { name, page, size } = body;
            const [doc, count] = await this.taskRepository.findAndCount({
                where: {
                    'status': 5,
                },
                relations: ['principal'],
                cache: true,
                order: {
                    createTime: 'DESC'
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
     * 分页查询所有任务
     * @param id 
     */
    async list(body:any): Promise<Result> {
        try {
            const { name, page, size } = body;
            const [doc, count] = await this.taskRepository.findAndCount({
                // where: {
                //     'status': 5,
                // },
                // relations: ['principal'],
                cache: true,
                order: {
                    createTime: 'DESC'
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
}
