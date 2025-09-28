import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entity/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}
  /** 项目列表
   *  查询当前登录人是项目成员的全部项目并且每个项目将包含的成员列表罗列出来
   */
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
  /**
   * 使用SQL
   * @param request
   * @param keywords
   * @param sort
   * @returns
   */
  async listsql(request: any, keywords: string, sort: string): Promise<any> {
    const orderP = sort ? sort : 'createDate'; // 字段名
    const userId = request.user.userId;
    const name = `%${keywords}%`;

    // ⚠️ 注意 orderP 要做白名单校验，避免 SQL 注入
    const allowedSorts = ['createDate', 'name', 'id'];
    const sortField = allowedSorts.includes(orderP) ? orderP : 'createDate';

    const sql = `
      SELECT p.*, m.*
      FROM project p
      INNER JOIN project_members pm1 
        ON p.id = pm1.project_id
      INNER JOIN member m1 
        ON pm1.member_id = m1.id
       AND m1.id = ?
      LEFT JOIN project_members pm2 
        ON p.id = pm2.project_id
      LEFT JOIN member m 
        ON pm2.member_id = m.id
      WHERE p.name LIKE ?
      ORDER BY p.${sortField} DESC
    `;

    return await this.projectRepository.query(sql, [userId, name]);
  }

  /** 项目详情 */
  async detail(id: string): Promise<any> {
    return await this.projectRepository.findOne({
      where: { id },
      relations: [
        'principal',
        'groups',
        'groups.tasks',
        'groups.tasks.owner',
        'groups.tasks.tags',
        'groups.tasks.iteration',
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
    project.principal = await this.userRepository.findOne({
      where: { id: request.user.userId },
    });
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
  async addMember({ projectId, memberIds }) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });
    const newMembers = await this.userRepository.find({
      where: { id: In(memberIds) },
    });
    project.members = newMembers;
    return await this.projectRepository.save(project);
  }

  /** 更新项目星标信息 */
  async star(id: string, star: boolean): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
    });
    project.star = star;
    return await this.projectRepository.save(project);
  }
  // 设置项目提醒
  async remind({ id, remindInterval, remindType }): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
    });
    project.remindInterval = remindInterval;
    project.remindType = remindType;
    return await this.projectRepository.save(project);
  }

  /** 删除项目 */
  async delete(id: string) {
    return await this.projectRepository.delete(id);
  }

  /** 项目中的任务按照不同维度统计 */
  async taskStatistics({ id, type }): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['members', 'iterations'],
    });
    // 按照时间统计
    if (type === '1') {
      const startDate = dayjs(project.startDate);
      const endDate = dayjs(project.endDate);
      if (!startDate.isValid() || !endDate.isValid()) {
        throw new Error('Invalid date format');
      }
      let list = [];
      let current = startDate;
      while (current.isBefore(endDate, 'day')) {
        list.push(current.format('MM月DD日')); // 需要什么格式可以改
        current = current.add(1, 'day');
      }
      return list.map((item) => {
        return {
          xLabel: item,
          yValue1: Math.ceil(Math.random() * 30),
          yValue2: Math.ceil(Math.random() * 20),
        };
      });
    } else if (type === '2') {
      // 按照成员统计
      return project.members.map((item) => {
        return {
          xLabel: item.nickname,
          yValue1: Math.ceil(Math.random() * 30),
          yValue2: Math.ceil(Math.random() * 20),
        };
      });
    } else {
      // 按照迭代统计
      return project.iterations.map((item) => {
        return {
          xLabel: item.name,
          yValue1: Math.ceil(Math.random() * 30),
          yValue2: Math.ceil(Math.random() * 20),
        };
      });
    }
  }
}
