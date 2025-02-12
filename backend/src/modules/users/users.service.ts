import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({relations: ['contents']});
    }

    async findById(id:number): Promise<User | null> {
        return await this.userRepository.findOne({where: {id}, relations: ['contents']});
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return await this.userRepository.save(newUser);
    }
}
