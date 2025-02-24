import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CsvService} from '../../csv/csv.service';
import {CreatorsDto} from '../dto/creators.dto';
import {plainToInstance} from 'class-transformer';
import {UserRole} from "../../users/enums/users-role.enum";
import {User} from "../../users/user.entity";
import {Creator} from "../entities/creators.entity";


@Injectable()
export class CreatorsService {
    constructor(
        @InjectRepository(Creator)
        private readonly creatorRepository: Repository<Creator>,
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
                .into(Creator)
                .values(uniqueUsers)
                .orIgnore() // 중복인 경우 삽입 무시
                .execute();
            console.log(`총 ${uniqueUsers.length}명의 크리에이터 데이터를 저장 완료!`);
        } catch (error) {
            console.error('User 데이터 저장 중 오류 발생:', error);
        }
    }



    async findAllCreators(): Promise<CreatorsDto[]> {
        const creators = await this.creatorRepository.find({
            relations: ['user'],
            where: { user: { role: UserRole.CREATOR } },
        });

        const validCreators = creators.filter(creator => creator.user);

        return validCreators.map(creator => new CreatorsDto(creator));
    }

    async findCreatorByIdWithContents(id: number): Promise<CreatorsDto> {
        const creator = await this.creatorRepository.findOne({
            where: { id, user: { role: UserRole.CREATOR } },
            relations: ['user', 'contents'],
        });

        if (!creator || !creator.user) {
            throw new NotFoundException(`ID ${id}에 해당하는 크리에이터를 찾을 수 없습니다.`);
        }

        return new CreatorsDto(creator);
    }
}
