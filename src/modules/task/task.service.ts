import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { TaskAddDTO } from './dto/task-add.dto';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Task } from './entities/task.entity';
import { Flow } from '../flow/entities/flow.entity';
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
    private readonly notificationService: NotificationService,
  ) {}

  // 查询当前用户的所有任务
  async list(keywords: string = '', request: any): Promise<any> {
    const doc = await this.taskRepository
      .createQueryBuilder('task')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.id = :id')
          .getQuery();
        return 'task.owner= ' + subQuery;
      })
      // .andWhere('task.name like "%' + keywords + '%"')
      .setParameter('id', request.user.userId)
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
  async create(taskAddDTO: TaskAddDTO, request: any): Promise<any> {
    const {
      name,
      description,
      flowId,
      priority,
      reminder,
      startDate,
      endDate,
    } = taskAddDTO;
    const task = new Task();
    task.name = name;
    task.description = description;
    task.priority = priority;
    task.reminder = reminder;
    task.startDate = startDate;
    task.endDate = endDate;
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
  async detail(taskId: number): Promise<any> {
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
  async delete(id: number, maneger: EntityManager): Promise<any> {
    return await this.taskRepository.delete(id);
  }
}
