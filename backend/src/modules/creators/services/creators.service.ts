import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Creators} from '../entities/creators.entity';
import {CsvService} from '../../csv/csv.service';
import {CreatorsDto} from '../dto/creators.dto';
import {plainToInstance} from 'class-transformer';
import {UserRole} from "../../users/enums/users-role.enum";


@Injectable()
export class CreatorsService {
    constructor(
        @InjectRepository(Creators)
        private readonly creatorRepository: Repository<Creators>,
        private readonly csvService: CsvService,
    ) {}

    async saveUsers(): Promise<void> {
        const users = await this.csvService.readUserCsv();
        if (!users.length) {
            console.log('User CSV에서 불러온 데이터가 없습니다.');
            return;
        }

        // CSV 데이터에서 userId(이메일)가 유효한 행만 필터링
        const validUsers = users.filter(user => user.userId && user.userId.trim() !== '');

        // 모든 CSV 데이터를 크리에이터로 저장
        const uniqueUsers = validUsers.map(user => ({
            ...user,
            role: UserRole.CREATOR, // CSV에서 불러온 유저는 크리에이터로 지정
        }));

        try {
            await this.creatorRepository
                .createQueryBuilder()
                .insert()
                .into(Creators)
                .values(uniqueUsers)
                .onConflict(`("userId") DO NOTHING`) // 중복이면 삽입 무시
                .execute();
            console.log(`총 ${uniqueUsers.length}명의 크리에이터 데이터를 저장 완료!`);
        } catch (error) {
            console.error('User 데이터 저장 중 오류 발생:', error);
        }
    }



    async findAllCreators(): Promise<CreatorsDto[]> {
        const creators = await this.creatorRepository.find({
            where: { role: UserRole.CREATOR }, // 역할이 'CREATOR'인 사용자만 조회
            select: ['id', 'userId', 'nickname', 'category', 'youtube', 'instagram', 'tiktok', 'profilePicture'],
        });
        return plainToInstance(CreatorsDto, creators, { excludeExtraneousValues: true });
    }

    async findCreatorByIdWithContents(id: number): Promise<CreatorsDto> {
        const creator = await this.creatorRepository.findOne({
            where: { id, role: UserRole.CREATOR },
            relations: ['contents'],
        });

        if (!creator) {
            throw new NotFoundException(`ID ${id}에 해당하는 크리에이터를 찾을 수 없습니다.`);
        }

        return plainToInstance(CreatorsDto, creator, { excludeExtraneousValues: true });
    }
}
