import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Any } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword, createCode } from '../../utils';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Project } from './entity/project.entity';
import { Client } from 'ssh2';

@Injectable()
export class ProjectService {
  ssh2Client: Client;

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.ssh2Client = new Client();
  }
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
    const shell = `git clone ${project.repository}`;
    console.log(this.ssh2Client);
    console.log(shell);
    // console.log(project);
    this.ssh2Client
      .on('ready', () => {
        console.log("服务器连接成功");
        this.ssh2Client.exec(shell, (err, stream) => {
          if (err) throw err;
          stream
            .on('close', (code, signal) => {
              console.log(
                'Stream :: close :: code: ' + code + ', signal: ' + signal,
              );
              this.ssh2Client.end();
            })
            .on('data', (data) => {
              console.log('STDOUT: ' + data);
            })
            .stderr.on('data', (data) => {
              console.log('STDERR: ' + data);
            });
        });
      })
      .connect({
        host: '129.211.164.125',
        port: 22,
        username: 'xxxxx',
        password: 'xxxxxxx',
      });
  }

  // 删除用户
  async deleteProject(id: number | string): Promise<any> {
    return await this.projectRepository.delete(id);
  }
}
