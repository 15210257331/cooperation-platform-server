import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Task } from './entities/task.entity';
import { Flow } from '../flow/entities/flow.entity';
import { NotificationService } from '../notification/notification.service';
import * as dayjs from 'dayjs';
import { Tag } from '../tag/entities/tag.entity';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly notificationService: NotificationService,
  ) {}

  // 查询当前用户的所有任务
  async list(body: any, request: any): Promise<any> {
    const { name, size, page } = body;
    const list = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.name like :name', { name: `%${name}%` })
      .andWhere('task.delete = true')
      .andWhere('task.owner = :id', {
        id: request.user.userId,
      })
      .setParameter('id', request.user.userId)
      .take(size)
      .skip((page - 1) * size)
      .orderBy('task.createDate', 'DESC')
      .getMany();
    const total = await this.taskRepository.count({
      where: { delete: true },
    });
    return { list, total };
  }

  /**
   * 添加任务
   * @param body
   * @param request
   * @returns
   */
  async create(taskAddDTO: TaskAddDTO, request: any): Promise<any> {
    const {
      name,
      description,
      flowId,
      priority,
      remind,
      tagIds,
      startDate,
      endDate,
    } = taskAddDTO;
    const task = new Task();
    task.name = name;
    task.description = description;
    task.priority = priority;
    task.remind = remind;
    task.startDate = startDate;
    task.endDate = endDate;
    task.tags = await this.tagRepository.findByIds(tagIds)
    task.flow = await this.flowRepository.findOne(flowId);
    task.owner = await this.userRepository.findOne(request.user.userId);
    const content = `在流程【${task.flow.name}】下创建了一个新任务:<b style="color:black;">${name}</b>`;
    await this.notificationService.addMessage(
      request.user.userId,
      '新建任务',
      content,
    );
    return await this.taskRepository.save(task);
  }

  /**
   * 查询任务详情
   * @param id
   */
  async detail(taskId: string): Promise<any> {
    return await this.taskRepository.findOne(taskId, {
      relations: ['owner'],
    });
  }

  /**
   * 任务更新单一属性
   * @param body
   * @returns
   */
  async updateProps(body: any): Promise<any> {
    const { taskId, propName, propValue } = body;
    const task = await this.taskRepository.findOne(taskId);
    if (propName === 'flow') {
      const flow = await this.flowRepository.findOne(propValue);
      task.flow = flow;
    } else {
      task[propName] = propValue;
    }
    return await this.taskRepository.save(task);
  }

  //删除任务
  async delete(id: string, maneger: EntityManager): Promise<any> {
    return await this.taskRepository.delete(id);
  }

  // 近14天任务完成情况
  async trend(type: number): Promise<any> {
    let data = [];
    if (type === 1) {
      data = [1, 2, 3, 4, 5, 6, 7];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'day').format('MM/DD'),
          total: Math.floor(Math.random() * 101),
        };
      });
    } else if (type === 2) {
      data = [1, 3, 5, 7, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'day').format('MM/DD'),
          total: Math.floor(Math.random() * 101),
        };
      });
    } else {
      data = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'month').format('YYYY/MM'),
          total: Math.floor(Math.random() * 101),
        };
      });
    }
  }
}
