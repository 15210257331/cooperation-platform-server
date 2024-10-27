import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import * as dayjs from 'dayjs';
import { Task } from '../task/entities/task.entity';
import { Project } from '../project/entities/project.entity';
import { Iteration } from './entities/iteration.entity';
import { CreateIterationDto } from './dto/create-iteration.dto';
@Injectable()
export class IterationService {
  constructor(
    @InjectRepository(Iteration)
    private readonly iterationRepository: Repository<Iteration>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly notificationService: NotificationService,
  ) {}

  // 查询标签列表
  async list(projectId: string, name: string, status: string): Promise<any> {
    const queryBuilder =
      this.iterationRepository.createQueryBuilder('iteration');
    if (status) {
      // 如果传入了status，则增加查询条件
      console.log(123, status)
      queryBuilder.where('iteration.status = :status', {
        status: parseInt(status),
      });
    }
    const list = await queryBuilder
      .where('iteration.name like :name', { name: `%${name}%` })
      .andWhere('iteration.project = :projectId', {
        projectId: projectId,
      })
      .leftJoinAndSelect('iteration.principal', 'principal')
      .orderBy('iteration.createDate', 'DESC')
      .getMany();
    return { list };
  }

  /**
   * 创建标签
   * @param body
   * @param request
   * @returns
   */
  async create(
    createIterationDto: CreateIterationDto,
    request: any,
  ): Promise<any> {
    const { projectId, name, type, content, startDate, endDate } =
      createIterationDto;
    const iteration = new Iteration();
    iteration.name = name;
    iteration.type = type;
    iteration.content = content;
    iteration.startDate = startDate;
    iteration.endDate = endDate;
    iteration.project = await this.projectRepository.findOne(projectId);
    await this.notificationService.addMessage(
      request.user.userId,
      '新建迭代',
      `在项目【${iteration.project.name}】下创建了一个新的迭代:<b style="color:black;">${name}</b>`,
    );
    return await this.iterationRepository.save(iteration);
  }
}
