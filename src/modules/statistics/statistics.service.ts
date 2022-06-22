import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Statistics } from './entity/statistics.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 例子
   * 分页获取应用列表 按照应用名称查询
   * 同时在列表中联查了其他实体的数据
   * @param body
   * @param request
   * @returns
   */
  //   async getApplicationList(body: any, request: any): Promise<any> {
  //     const { name, pageIndex, pageSize } = body;
  //     const applications = await this.applicationRepository
  //       .createQueryBuilder('application')
  //       .select('application.name', 'name')
  //       .addSelect('application.id', 'id')
  //       .addSelect('application.applicationType', 'applicationType')
  //       .addSelect('application.deployType', 'deployType')
  //       .addSelect('application.deployPort', 'deployPort')
  //       .addSelect('application.remark', 'remark')
  //       .addSelect('application.createDate', 'createDate')
  //       .where('application.name like :name', { name: `%${name}%` })
  //       .andWhere('application.belongId = :id', {
  //         id: request.user.userId,
  //       })
  //       .addSelect((subQuery) => {
  //         return subQuery
  //           .select('history.result', 'result')
  //           .from(History, 'history')
  //           .where('history.applicationId = application.id')
  //           .orderBy('history.startDate', 'DESC')
  //           .limit(1);
  //       }, 'result')
  //       .addSelect((subQuery) => {
  //         return subQuery
  //           .select('host.hostAddress', 'hostAddress')
  //           .from(Host, 'host')
  //           .where('host.id = application.hostId');
  //       }, 'hostAddress')
  //       .take(pageSize)
  //       .skip((pageIndex - 1) * pageSize)
  //       .orderBy('application.createDate', 'DESC')
  //       .getRawMany();
  //     const total = await this.applicationRepository.count();
  //     return {
  //       list: applications,
  //       total: total,
  //     };
  //   }

  /**
   * 查的是历史列表 历史一对多管理应用 可按照应用名称搜索
   * @param queryParams
   * @returns
   */
  //    async list(queryParams: any) {
  //     const { name, pageIndex, pageSize } = queryParams;
  //     const [users, count] = await this.historyRepository
  //       .createQueryBuilder('history')
  //       .leftJoinAndSelect('history.application', 'application')
  //       .where('application.name like :name', { name: `%${name}%` })
  //       .leftJoinAndSelect('application.host', 'host')
  //       .take(pageSize)
  //       .skip((pageIndex - 1) * pageSize)
  //       .orderBy('history.startDate', 'DESC')
  //       .select([
  //         'history.id',
  //         'history.startDate',
  //         'history.endDate',
  //         'history.result',
  //         'history.commit',
  //         'history.branch',
  //         'application.id',
  //         'application.name',
  //         'application.deployType',
  //         'application.deployPort',
  //         'host.name',
  //         'host.hostAddress',
  //         'host.remark',
  //       ])
  //       .getManyAndCount();

  async addVisit(body: any): Promise<any> {
    const { count, visitDate } = body;
    const doc = await this.statisticsRepository.findOne({
      visitDate: visitDate,
    });
    if (doc) {
      doc.count += 1;
      const data = await this.statisticsRepository.save(doc);
      return { data };
    } else {
      const statistics = new Statistics();
      statistics.count = count;
      statistics.visitDate = visitDate;
      return await this.statisticsRepository.save(statistics);
    }
  }

  async visitCount(): Promise<any> {
    const doc = await this.statisticsRepository.find();
    let todayDoc = doc.filter(
      (item) => item.visitDate === dayjs().format('YYYY-MM-DD'),
    );
    const today = todayDoc.length > 0 ? todayDoc[0].count : 0;
    let yestodayDoc = doc.filter(
      (item) =>
        item.visitDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    );
    const yestoday = yestodayDoc.length > 0 ? yestodayDoc[0].count : 0;
    let total = 0;
    doc.map((item) => {
      total += item.count;
    });
    const totalUser = await this.userRepository.count();
    return {
      today: today,
      yestoday: yestoday,
      total: total,
      register: totalUser,
    };
  }

  async userRank(type: number): Promise<any> {
    let users = await this.userRepository.find({
      relations: ['tasks'],
    });
    let data = users.map((user, index) => {
      const total = user.tasks.length;
      const complete = user.tasks.filter(
        (task) => task.complete === true,
      ).length;
      const percent =
        total > 0 ? parseFloat((complete / total).toFixed(2)) * 100 : 0;
      return {
        nickname: user.nickname,
        total: total,
        complete: complete,
        percent: percent,
      };
    });
    if (type === 1) {
      data.sort((a, b) => b.total - a.total);
    } else {
      data.sort((a, b) => b.percent - a.percent);
    }
    if (users.length > 5) {
      data = data.slice(0, 5);
    }
    return data;
  }

  // 近14天任务完成情况
  async taskTrend(type: number): Promise<any> {
    let data = [];
    if (type === 1) {
      data = [1, 2, 3, 4, 5, 6, 7];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'day').format('MM.DD') + '日',
          total: Math.floor(Math.random() * 101),
        };
      });
    } else if (type === 2) {
      data = [1, 3, 5, 7, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'day').format('MM.DD') + '日',
          total: Math.floor(Math.random() * 101),
        };
      });
    } else {
      data = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
      return data.reverse().map((item) => {
        return {
          date: dayjs().subtract(item, 'month').format('YY-MM') + '月',
          total: Math.floor(Math.random() * 101),
        };
      });
    }
  }
}
