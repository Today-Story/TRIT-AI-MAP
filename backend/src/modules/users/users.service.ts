import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CsvService } from '../csv/csv.service';
import { UserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { ContentDto } from '../contents/contents.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly csvService: CsvService,
    ) {}

    async saveUsers(): Promise<void> {
        const users = await this.csvService.readUserCsv();
        if (!users.length) {
            console.log('User CSV에서 불러온 데이터가 없습니다.');
            return;
        }
        const uniqueUsersMap = new Map(users.map(user => [user.userId, user]));
        const uniqueUsers = Array.from(uniqueUsersMap.values());
        try {
            await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(users)
                .onConflict(`("userId") DO NOTHING`)
                .execute();
            console.log(`총 ${uniqueUsers.length}명의 사용자 데이터를 저장 완료!`);
        } catch (error) {
            console.error('User 데이터 저장 중 오류 발생:', error);
        }
    }

    async findAll(): Promise<UserDto[]> {
        // contents 관계를 포함하지 않고, 사용자 기본 정보만 조회
        const users = await this.userRepository.find({
            select: ['id', 'userId', 'nickname', 'category', 'youtube', 'instagram', 'tiktok', 'profilePicture'],
        });
        return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
    }

    async findById(id: number): Promise<UserDto | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['contents'],
        });
        return user ? plainToInstance(UserDto, user, { excludeExtraneousValues: true }) : null;
    }
}
