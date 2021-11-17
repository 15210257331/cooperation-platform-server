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
        try {
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
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    /**
     * 分页角色列表
     * @param body 
     */
    async roleList(body: any): Promise<any> {
        try {
            const { name, page, size } = body;
            const [doc, count] = await this.roleRepository.findAndCount({
                where: {
                    'name': Like(`%${name}%`),
                },
                cache: true,
                order: {
                    createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
                },
                skip: (page - 1) * size,
                take: size,
            });
            return {
                code: 10000,
                data: {
                    list: doc,
                    total: count
                },
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    /**
     * 角色列表部分页
     * @param body 
     */
    async allRole(): Promise<any> {
        try {
            const doc = await this.roleRepository.find({
                cache: true,
                order: {
                    createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
                },
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    async roleDelete(id: number | string): Promise<any> {
        try {
            const doc = await this.roleRepository.delete(id)
            return {
                code: 10000,
                data: doc,
                msg: 'Success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }
    async roleUpdate(roleUpdateDTO: RoleUpdateDTO): Promise<any> {
        try {
            const id = roleUpdateDTO.id;
            const doc = await this.roleRepository.update(id, {
                'name': roleUpdateDTO.name,
                'description': roleUpdateDTO.description,
            });
            return {
                code: 10000,
                data: doc,
                msg: 'Success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }


    async relevanceAuthority(roleAuthorityDTO: RoleAuthorityDTO): Promise<any> {
        try {
            const { id, authority } = roleAuthorityDTO;
            const doc = await this.roleRepository.update(id, {
                'authority': authority,
            });
            return {
                code: 10000,
                data: doc,
                msg: 'Success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

}
