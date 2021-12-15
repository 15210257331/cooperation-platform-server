import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './user.entity';
/**
 * 实体对应数据库中的表 字段类型会类比映射到数据库支持的类型
 * 你也可以通过在@Column装饰器中隐式指定列类型来使用数据库支持的任何列类型
 */
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        comment: '名称',
        type: 'varchar',
        nullable: false,
        length: 50,
        charset: 'utf8mb4',
        name: 'name',
    })
    name: string;

    @Column({
        comment: '描述',
        type: 'text',
        name: 'description',
        charset: 'utf8mb4',
    })
    description: string;

    @Column({
        type: 'int',
        name: 'valid',
        nullable: true,
        default: () => 1,
        comment: '有效性 1有效 2无效'
    })
    valid: number;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'createDate',
        comment: '创建时间',
    })
    createDate: Date;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        name: 'updateDate',
        comment: '更新时间',
    })
    updateDate: Date;

    // 有一种称为simple-array的特殊列类型，它可以将原始数组值存储在单个字符串列中
    @Column({
        type: 'simple-array',
        charset: 'utf8mb4',
        comment: '权限列表',
        name: 'authority',
    })
    authority: string[];

    /**
     * 角色和用户是多对多的关系
     */
    @ManyToMany(() => User, user => user.roles, {
        cascade: true
    })
    @JoinTable({
        name: 'role_user' // 自定义关联表名称
    })
    users: User[];
}
