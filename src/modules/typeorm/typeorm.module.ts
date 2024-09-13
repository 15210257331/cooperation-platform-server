import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('db');
        // console.log(db);
        return {
          type: 'mysql',
          connectorPackage: "mysql2",
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: ['dist/**/*.entity{.ts,.js}'],
          charset: 'utf8mb4',
          synchronize: true,
        };
      },
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class TypeormModule {}
