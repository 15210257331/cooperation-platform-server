import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from 'typeorm';
@Entity()
export class Statistics {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        name: 'count',
        default: () => 0,
        nullable: true,
        comment: '次数'
    })
    count: number;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'visitDate',
        comment: '访问时间',
    })
    visitDate: string;
}
