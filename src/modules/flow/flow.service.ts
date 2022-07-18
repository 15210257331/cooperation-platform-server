import {
  HttpException,
  Injectable,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Flow } from './entities/flow.entity';
import { Task } from '../task/entities/task.entity';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Flow) private readonly flowRepository: Repository<Flow>,
    private readonly notificationService: NotificationService,
  ) {}

  /**新增节点 */
  async create(flowAddDTO: CreateFlowDto, request: any): Promise<any> {
    const { name, sort, range, complete, canNew } = flowAddDTO;
    const flow = new Flow();
    flow.name = name;
    flow.sort = sort;
    flow.range = range;
    flow.canNew = canNew;
    flow.complete = complete;
    flow.belong = await this.userRepository.findOne(request.user.userId);
    flow.tasks = [];
    console.log(flow);
    // 消息通知
    const content = `新创建了一个流程: <b style="color:black;">${name}</b>`;
    this.notificationService.addMessage(
      request.user.userId,
      '新建流程',
      content,
    );
    return await this.flowRepository.save(flow);
  }

  /** 节点列表 */
  async list(name: string, request: any): Promise<any> {
    return await this.flowRepository
      .createQueryBuilder('flow')
      .where('flow.name like :name', { name: `%${name}%` })
      .andWhere('flow.belongId = :id', {
        id: request.user.userId,
      })
      .leftJoinAndSelect('flow.tasks', 'tasks', 'tasks.delete = false')
      .getMany();
  }

  /** 所有节点 */
  async all(request: any): Promise<any> {
    return await this.flowRepository
      .createQueryBuilder('flow')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.id = :id')
          .getQuery();
        return 'flow.belong= ' + subQuery;
      })
      .setParameter('id', request.user.userId)
      .getMany();
  }

  // 更新节点
  async update(flowUpdateDTO: UpdateFlowDto): Promise<any> {
    const { id, name, sort, range, canNew, complete } = flowUpdateDTO;
    await this.flowRepository.update(id, {
      name: name,
      range: range,
      canNew: canNew,
      sort: sort,
      complete: complete,
    });
    const doc = await this.flowRepository.findOne(id, {
      relations: ['tasks'],
    });
    return doc;
  }

  // 删除节点
  async delete(id: number, maneger: EntityManager): Promise<any> {
    const flow = await this.flowRepository.findOne(id);
    // 如果该分组下的任务不为空则不允许删除
    const tasks = await maneger.find(Task, { flow: flow });
    if (tasks.length > 0) {
      throw new HttpException('该分组任务不为空，无法删除', 200);
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
      relations: ['creator', 'tasks'],
    });
  }
}
