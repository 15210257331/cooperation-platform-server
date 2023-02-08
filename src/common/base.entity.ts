import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
/** 实体基类 */
export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'createDate',
    comment: '创建时间',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updateDate',
    comment: '更新时间',
  })
  updateDate: Date;
}
