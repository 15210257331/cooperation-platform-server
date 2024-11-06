import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { NotificationService } from '../notification/notification.service';
import * as dayjs from 'dayjs';
import { TagAddDTO } from './dto/tag-add.dto';
import { Task } from '../task/entities/task.entity';
import { Project } from '../project/entities/project.entity';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly notificationService: NotificationService,
  ) {}

  // 查询标签列表
  async list(projectId: string): Promise<any> {
    const list = await this.tagRepository
      .createQueryBuilder('tag')
      .andWhere('tag.project = :projectId', {
        projectId: projectId,
      })
      .getMany();
    return { list };
  }

  /**
   * 创建标签
   * @param body
   * @param request
   * @returns
   */
  async create(tagAddDTO: TagAddDTO, request: any): Promise<any> {
    const { name, projectId } = tagAddDTO;
    const tag = new Tag();
    tag.name = name;
    tag.project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    await this.notificationService.addMessage(
      request.user.userId,
      '新建标签',
      `在项目【${tag.project.name}】下创建了一个新标签:<b style="color:black;">${name}</b>`,
    );
    return await this.tagRepository.save(tag);
  }
}
