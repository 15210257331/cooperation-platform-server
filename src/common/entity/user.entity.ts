import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { Role } from './role.entity';
import { Task } from './task.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
        unique: true,
        name: 'username',
        comment: '用户名',
    })
    username: string;

    @Column({
        length: 500,
        type: 'varchar',
        nullable: false,
        comment: '密码',
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 50,
        charset: 'utf8mb4',
        comment: '姓名/昵称'
    })
    nickname: string;

    @Column({
        length: 50,
        comment: '邮箱'
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 11,
        comment: '电话'
    })
    phone: number;

    @Column({
        type: 'varchar',
        nullable: false,
        default: 'https://c-ssl.duitang.com/uploads/item/201608/02/20160802001436_CtfiH.jpeg',
        name: 'avatar',
        comment: '头像'
    })
    avatar: string;

    @Column({
        type: 'text',
        comment: '个人介绍',
        name: 'introduction',
        charset: 'utf8mb4',
    })
    introduction: string;

    @Column({
        type: 'int',
        name: 'sex',
        nullable: false,
        default: () => 1,
        comment: '性别 1表示男 2表示女'
    })
    sex: number;

    @Column({
        type: 'int',
        name: 'status',
        default: () => 1,
        nullable: false,
        comment: '用户状态 1在职 2离职'
    })
    status: number;

    // 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置
    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createDate',
        comment: '创建时间',
    })
    createDate: Date;


    /**
     * 用户和分组是一对多的关系
     *  */
    @OneToMany(() => Group, group => group.creator)
    groups: Group[];

    /**
     * 角色和用户是多对多的关系
     */
    @ManyToMany(() => Role, role => role.users,)
    roles: Role[];
}
