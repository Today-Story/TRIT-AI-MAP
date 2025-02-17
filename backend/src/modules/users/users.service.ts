import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CsvService} from "../csv/csv.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly csvService: CsvService,
    ) {}

    async importUsersFromCsv(): Promise<void> {
        const users = await this.csvService.readUserCsv();

        if (!users.length) {
            console.log('User CSV에서 불러온 데이터가 없습니다.');
            return;
        }

        try {
            for (const user of users) {
                const existingUser = await this.userRepository.findOne({ where: { userId: user.userId } });

                if (!existingUser) {
                    await this.userRepository.save(user);
                    console.log(`저장된 사용자: ${user.nickname} (${user.userId})`);
                } else {
                    console.log(`이미 존재하는 사용자: ${user.nickname} (${user.userId})`);
                }
            }

            console.log(`총 ${users.length}명의 사용자 데이터를 저장 완료!`);
        } catch (error) {
            console.error('User 데이터 저장 중 오류 발생:', error);
        }
    }


    async findAll(): Promise<User[]> {
        return await this.userRepository.find({relations: ['contents']});
    }

    //  특정 사용자 조회 (userId 기준)
    async findByUserId(userId: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { userId },
            relations: ['contents'],
        });
    }

    //  특정 사용자 조회 (id 기준)
    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['contents'],
        });
    }
}
