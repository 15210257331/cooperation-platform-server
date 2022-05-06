import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Any } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword, createCode } from '../../utils';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Project } from './entity/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * @param registerDTO
   * @returns
   */
  async createProject(data: any): Promise<any> {
    console.log(data);
    const {
      name,
      host,
      port,
      projectType,
      deployType,
      username,
      remark,
      password,
    } = data;
    const user = new Project();
    user.username = username;
    user.password = password;
    user.name = name;
    user.host = host;
    user.port = port;
    user.projectType = projectType;
    user.deployType = deployType;
    user.remark = remark;
    return await this.projectRepository.save(user);
  }

  async getProjectList(name: string): Promise<any> {
    return await this.projectRepository.find({
      // where: {
      //   name: Like(`%${name}%`),
      // },
      cache: true,
      order: {
        createDate: 'ASC', //ASC 按时间正序 DESC 按时间倒序
      },
    });
  }

  async startDeploy(id: number): Promise<any> {
    const project = await this.projectRepository.findOne(id);
    console.log(project);
    return true;
  }

  // 删除用户
  async deleteProject(id: number | string): Promise<any> {
    return await this.projectRepository.delete(id);
  }
}
