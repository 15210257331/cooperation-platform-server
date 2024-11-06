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
  async list(request: any, keywords: string, sort: string): Promise<any> {
    const orderP = sort ? `project.${sort}` : 'project.createDate';
    return await this.projectRepository
      .createQueryBuilder('project')
      .where('project.name like :name', { name: `%${keywords}%` })
      .innerJoin('project.members', 'members')
      .andWhere('members.id = :id', {
        id: request.user.userId,
      })
      .leftJoinAndSelect('project.members', 'member')
      .orderBy(orderP, 'DESC')
      .getMany();
  }

  /** 项目详情 */
  async detail(id: string): Promise<any> {
    return await this.projectRepository.findOne({
      where: { id },
      relations: [
        'groups',
        'groups.tasks',
        'groups.tasks.owner',
        'groups.tasks.tags',
        'members',
        'tags',
      ],
    });
  }

  /** 创建项目 */
  async create(createProjectDto: CreateProjectDto, request: any) {
    const { name, icon, type, star, cover, startDate, endDate } =
      createProjectDto;
    const project = new Project();
    project.name = name;
    project.icon = icon;
    project.cover = cover;
    project.type = type;
    project.star = star;
    project.startDate = startDate;
    project.endDate = endDate;
    project.members = await this.userRepository.find(request.user.userId);
    console.log(project);
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
    return await this.projectRepository.findOne({
      where: { id: id },
    });
  }

  // 查询项目成员
  async findUsersByProjectId(projectId: string): Promise<User[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['users'], // 加载关联的用户
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project.members;
  }

  // 添加项目成员
  async addMember({ projectId, memberId }) {
    console.log(memberId);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });
    const newMembers = await this.userRepository.findOne(memberId);
    console.log(newMembers);
    project.members = [...project.members, newMembers];
    return await this.projectRepository.save(project);
  }

  /** 更新项目星标信息 */
  async star(id: string, star: boolean): Promise<any> {
    return await this.projectRepository.update(id, { star });
  }

  /** 删除项目 */
  async delete(id: string) {
    return await this.projectRepository.delete(id);
  }
}
