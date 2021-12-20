import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RoleAddDTO } from './dto/role-add.dto';
import { RoleAuthorityDTO } from './dto/role-authority';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { Role } from '../../common/entity/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) { }

    async roleAdd(roleAddDTO: RoleAddDTO): Promise<any> {
        const data = new Role();
        data.name = roleAddDTO.name;
        data.description = roleAddDTO.description;
        data.valid = 1;
        data.authority = [];
        const doc = await this.roleRepository.insert(data);
        return {
            code: 10000,
            data: doc,
            msg: 'Success',
        };
    }

    /**
     * 分页角色列表
     * @param body 
     */
    async roleList(body: any): Promise<any> {
        const { name, page, size } = body;
        const [doc, count] = await this.roleRepository.findAndCount({
            where: {
                'name': Like(`%${name}%`),
            },
            cache: true,
            order: {
                createDate: 'ASC' //ASC 按时间正序 DESC 按时间倒序
            },
            skip: (page - 1) * size,
            take: size,
        });
        return {
            data: {
                list: doc,
                total: count
            },
        };
    }

    /**
     * 角色列表部分页
     * @param body 
     */
    async roleAll(): Promise<any> {
        const doc = await this.roleRepository.find({
            cache: true,
            order: {
                createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
            },
        });
        return {
            data: doc,
        };
    }

    async roleDelete(id: number | string): Promise<any> {
        const doc = await this.roleRepository.delete(id)
        return {
            data: doc,
        };
    }

    async roleInfo(id: number): Promise<any> {
        const doc = await this.roleRepository.findOne(id)
        return {
            data: doc,
        };
    }

    // 修改角色信息 包括本角色的权限修改
    async roleUpdate(roleUpdateDTO: RoleUpdateDTO): Promise<any> {
        const { id, authority, name, description } = roleUpdateDTO;
        const doc = await this.roleRepository.update(id, {
            'name': roleUpdateDTO.name,
            'description': roleUpdateDTO.description,
            'authority': authority,
        });
        return {
            data: doc,
        };
    }
}
