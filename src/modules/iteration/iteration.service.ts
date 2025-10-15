import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import * as dayjs from 'dayjs';
import { Task } from '../task/entities/task.entity';
import { Project } from '../project/entities/project.entity';
import { Iteration } from './entities/iteration.entity';
import { CreateIterationDto } from './dto/create-iteration.dto';
import { User } from '../user/entity/user.entity';
import { UpdateIterationDto } from './dto/update-iteration.dto';
@Injectable()
export class IterationService {
  constructor(
    @InjectRepository(Iteration)
    private readonly iterationRepository: Repository<Iteration>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly notificationService: NotificationService,
  ) {}

  // 查询迭代列表
  async list(projectId: string, name: string, status: string): Promise<any> {
    const queryBuilder =
      this.iterationRepository.createQueryBuilder('iteration');
    if (status) {
      // 如果传入了status，则增加查询条件
      queryBuilder.where('iteration.status = :status', {
        status: parseInt(status),
      });
    }
    const list = await queryBuilder
      .andWhere('iteration.name like :name', { name: `%${name}%` })
      .andWhere('iteration.project = :projectId', {
        projectId: projectId,
      })
      .leftJoinAndSelect('iteration.principal', 'principal')
      .leftJoinAndSelect('iteration.tasks', 'tasks')
      .orderBy('iteration.createDate', 'DESC')
      .getMany();
    const currentDate = new Date();
    list.map((item) => {
      const progress = this.calculateProgress(
        currentDate,
        item.startDate,
        item.endDate,
      );
      item.progress = Math.floor(progress);
    });
    return { list };
  }

  /**
   * 创建迭代
   * @param body
   * @param request
   * @returns
   */
  async create(
    createIterationDto: CreateIterationDto,
    request: any,
  ): Promise<any> {
    const { projectId, name, type, content, startDate, endDate, attachment } =
      createIterationDto;
    const iteration = new Iteration();
    iteration.name = name;
    iteration.type = type;
    iteration.content = content;
    iteration.startDate = startDate;
    iteration.endDate = endDate;
    iteration.attachment = attachment;
    iteration.principal = await this.userRepository.findOne({
      where: { id: request.user.userId },
    });
    iteration.project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    await this.notificationService.addMessage(
      request.user.userId,
      '新建迭代',
      `在项目<b style="color:black;">【${iteration.project.name}】</b>下创建了一个新的迭代:<b style="color:black;">【${name}】</b>`,
    );
    return await this.iterationRepository.save(iteration);
  }

  /**
   * 更新迭代
   * @param body
   * @param request
   * @returns
   */
  async update(
    updateIterationDto: UpdateIterationDto,
    request: any,
  ): Promise<any> {
    const { id, status, name, type, content, attachment, startDate, endDate } =
      updateIterationDto;
    return await this.iterationRepository.update(id, {
      name,
      type,
      content,
      attachment,
      startDate,
      endDate,
    });
  }

  // 迭代状态置为完成
  async complete(
    updateIterationDto: UpdateIterationDto,
    request: any,
  ): Promise<any> {
    const { id, status } = updateIterationDto;
    return await this.iterationRepository.update(id, {
      status,
    });
  }

  /** 删除迭代 */
  async delete(id: string) {
    return await this.iterationRepository.delete(id);
  }

  // 动态计算迭代进度
  private calculateProgress(
    currentTime: Date,
    startTime: Date,
    endTime: Date,
  ): number {
    if (currentTime < startTime) {
      return 0;
    } else if (currentTime > endTime) {
      return 100;
    } else {
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsedDuration = currentTime.getTime() - startTime.getTime();
      return Math.min((elapsedDuration / totalDuration) * 100, 100);
    }
  }
}
