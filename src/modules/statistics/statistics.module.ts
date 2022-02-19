import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from '../../common/entity/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { User } from '../../common/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistics,User]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService]
})
export class StatisticsModule {}
