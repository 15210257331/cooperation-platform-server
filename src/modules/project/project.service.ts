import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entity/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}
  /** 项目列表 */
  async list(request: any, sort: string): Promise<any> {
    const orderP = sort ? `project.${sort}` : 'project.createDate';
    return await this.projectRepository
      .createQueryBuilder('project')
      .andWhere('project.belongId = :id', {
        id: request.user.userId,
      })
      .orderBy(orderP, 'DESC')
      .getMany();
  }

  /** 项目详情 */
  async detail(id: string): Promise<any> {
    return await this.projectRepository.findOne(id, {
      relations: ['groups', 'groups.tasks'],
    });
  }

  /** 创建项目 */
  async create(createProjectDto: CreateProjectDto, request: any) {
    const { name, icon, type, star, cover } = createProjectDto;
    const project = new Project();
    project.name = name;
    project.icon = icon;
    project.cover = cover;
    project.type = type;
    project.star = star;
    project.belong = await this.userRepository.findOne(request.user.userId);
    return await this.projectRepository.save(project);
  }

  /** 更新项目信息 */
  async update(updateProjectDto: UpdateProjectDto): Promise<any> {
    const { id, name, icon, type, star, cover } = updateProjectDto;
    await this.projectRepository.update(id, {
      name: name,
      icon: icon,
      cover: cover,
      type: type,
      star: star,
    });
    return await this.projectRepository.findOne(id);
  }

  /** 更新项目星标信息 */
  async star(id: string, star: boolean): Promise<any> {
    return await this.projectRepository.update(id, { star });
  }

  /** 删除项目 */
  async delete(id: number) {
    return await this.projectRepository.delete(id);
  }
}
