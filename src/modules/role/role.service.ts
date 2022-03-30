import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RoleAddDTO } from './dto/role-add.dto';
import { RoleAuthorityDTO } from './dto/role-authority';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { Role } from '../../entity/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) { }

    async roleAdd(roleAddDTO: RoleAddDTO): Promise<any> {
        const role = new Role();
        role.name = roleAddDTO.name;
        role.description = roleAddDTO.description;
        role.valid = roleAddDTO.valid;
        role.authority = roleAddDTO.authority;
        return await this.roleRepository.insert(role);
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
            list: doc,
            total: count
        }
    }

    /**
     * 角色列表部分页
     * @param body 
     */
    async roleAll(): Promise<any> {
        return await this.roleRepository.find({
            cache: true,
            order: {
                createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
            },
        });
    }

    async roleDelete(id: number | string): Promise<any> {
        return await this.roleRepository.delete(id)
    }

    async roleInfo(id: number): Promise<any> {
        return await this.roleRepository.findOne(id)
    }

    // 修改角色信息 包括本角色的权限修改
    async roleUpdate(roleUpdateDTO: RoleUpdateDTO): Promise<any> {
        const { id, authority, name, description } = roleUpdateDTO;
        return await this.roleRepository.update(id, {
            'name': roleUpdateDTO.name,
            'description': roleUpdateDTO.description,
            'authority': authority,
        });
    }
}