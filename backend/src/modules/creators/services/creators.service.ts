import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CsvService} from '../../csv/csv.service';
import {CreatorsDto} from '../dto/creators.dto';
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

        // 이메일이 유효한 데이터만 필터링
        const validUsers = users.filter(
            user => user.userData && user.userData.email && user.userData.email.trim() !== ''
        );

        // 각 유저 데이터에 대해
        for (const userData of validUsers) {
            const email = userData.userData.email.trim();
            let existingUser = await this.userRepository.findOne({ where: { email } });
            if (!existingUser) {
                existingUser = await this.userRepository.save({
                    email,
                    nickname: userData.userData.nickname ? userData.userData.nickname.trim() : email,
                    gender: userData.userData.gender ? userData.userData.gender.trim() : null,
                    profileImage: userData.creatorData.profileImage || null,
                    role: UserRole.CREATOR,
                });
            } else {
                console.log(`이미 존재하는 유저: ${email}`);
            }

            // 해당 User로 Creator 엔티티 생성(이미 Creator가 있는지 확인 가능)
            const existingCreator = await this.creatorRepository.findOne({
                where: { user: { id: existingUser.id } },
            });

            if (!existingCreator) {
                await this.creatorRepository.save({
                    user: existingUser,
                    category: userData.creatorData.category || "",
                    youtube: userData.creatorData.youtube || null,
                    instagram: userData.creatorData.instagram || null,
                    tiktok: userData.creatorData.tiktok || null,
                    profileImage: userData.creatorData.profileImage || null,
                    introduction: userData.creatorData.introduction || null,
                });
            } else {
                console.log(`이미 크리에이터로 등록된 유저: ${email}`);
            }
        }
        console.log(`총 ${validUsers.length}명의 CSV 데이터를 처리 완료!`);
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
