import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Statistics } from '../../common/entity/statistics.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../../common/entity/user.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Statistics) private readonly statisticsRepository: Repository<Statistics>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async addVisit(body: any): Promise<any> {
        const { count, visitDate } = body;
        const doc = await this.statisticsRepository.findOne({
            visitDate: visitDate
        })
        if (doc) {
            doc.count += 1;
            const data = await this.statisticsRepository.save(doc);
            return { data };
        } else {
            const statistics = new Statistics();
            statistics.count = count;
            statistics.visitDate = visitDate;
            const data = await this.statisticsRepository.save(statistics);
            return { data };
        }

    }

    async data(): Promise<any> {
        const doc = await this.statisticsRepository.find();
        let todayDoc = doc.filter(item => item.visitDate === dayjs().format('YYYY-MM-DD'));
        const today = todayDoc.length > 0 ? todayDoc[0].count : 0;

        let yestodayDoc = doc.filter(item => item.visitDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
        const yestoday = yestodayDoc.length > 0 ? todayDoc[0].count : 0;
        console.log(yestoday);
        let total = 0;
        doc.map(item => {
            total += item.count;
        })
        const totalUser = await this.userRepository.count();
        const data = {
            today: today,
            yestoday: yestoday,
            total: total,
            register: totalUser
        }
        return { data };
    }

}
