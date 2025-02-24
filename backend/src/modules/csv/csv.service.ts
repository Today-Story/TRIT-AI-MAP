import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { BusinessCategory } from '../business/entities/business.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Creator} from "../creators/entities/creators.entity";
import {Category} from "../../common/enum/category.enum";
import {User} from "../users/user.entity";
import {UserRole} from "../users/enums/users-role.enum";
import {mapCategory, mapGender} from "../../common/csv-mapper.util";

@Injectable()
export class CsvService {
    constructor(
        @InjectRepository(Creator)
        private readonly creatorRepository: Repository<Creator>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // 중복 생성 방지를 위한 promise 캐시
    private userCreationPromises: Map<string, Promise<Creator>> = new Map();

    async readUserCsv(): Promise<any[]> {
        return this.readCsvFile('user.csv', this.formatCreatorData.bind(this));
    }

    async readContentCsv(): Promise<any[]> {
        const users = await this.creatorRepository.find({ relations: ['user'] });
        const userMap = new Map(users.map(user => [user.user.email.trim().toLowerCase(), user]));
        return this.readCsvFile('content.csv', (data) => this.formatContentData(data, userMap));
    }


    async readProductCsv(): Promise<any[]> {
        return this.readCsvFile('product.csv', this.formatBusinessData.bind(this));
    }

    private async readCsvFile(filename: string, formatter: (data: any) => Promise<any>): Promise<any[]> {
        const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
        const filePath = path.join(process.cwd(), baseDir, 'data', filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(`CSV 파일이 존재하지 않습니다: ${filePath}`);
        }

        const promises: Promise<any>[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => {
                    const formattedData = this.normalizeCsvKeys(data);
                    // formatter가 비동기 함수이므로 Promise를 배열에 넣습니다.
                    promises.push(formatter(formattedData));
                })
                .on('end', async () => {
                    try {
                        const resolvedResults = await Promise.all(promises);
                        console.log(`${filename}에서 불러온 데이터 개수: ${resolvedResults.length}`);
                        resolve(resolvedResults);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (err) => reject(err));
        });
    }


    private normalizeCsvKeys(data: any): any {
        const normalizedData: any = {};
        Object.keys(data).forEach((key) => {
            // BOM 제거 및 공백 트림
            const cleanKey = key.replace(/\ufeff/g, '').trim();
            normalizedData[cleanKey] = data[key]?.toString().replace(/\ufeff/g, '').trim();
        });
        return normalizedData;
    }


    private formatCreatorData(data: any) {
        return {
            userData: {
                gender: data['성별'] ? mapGender(data['성별']) : null,
                nickname: data['활동명(닉네임)'] ? data['활동명(닉네임)'].trim() : '',
                email: data['트릿아이디'] ? data['트릿아이디'].trim() : '',
            },
            creatorData: {
                category: data['카테고리'] ? mapCategory(data['카테고리']) : null,
                youtube: data['유튜브'] ? data['유튜브'].trim() : null,
                instagram: data['인스타'] ? data['인스타'].trim() : null,
                tiktok: data['틱톡'] ? data['틱톡'].trim() : null,
                profileImage: data['프로필이미지'] ? data['프로필이미지'].trim() : null,
                introduction: null,
            },
        };
    }


    private formatBusinessData(data: any) {
        return {
            name: data['서비스명'] ? data['서비스명'].trim() : null,
            category: data['카테고리'] ? this.mapBusinessCategory(data['카테고리']) : BusinessCategory.ALL,
            company: data['회사명'] ? data['회사명'].trim() : null,
            phone: data['전화번호'] ? data['전화번호'].trim() : null,
            price: data['서비스가'] ? data['서비스가'].trim() : null,
            contactPerson: data['담당자'] ? data['담당자'].trim() : null,
            website: data['회사홈페이지'] ? data['회사홈페이지'].trim() : null,
        };
    }

    private async formatContentData(data: any, userMap: Map<string, Creator>): Promise<any> {
        if (!data['게시물 번호'] || data['게시물 번호'].trim() === '') {
            console.warn('게시물 번호 값이 누락되어 건너뜁니다:', data);
            return null;
        }
        const rawPostNumber = data['게시물 번호'];
        const postNumber = Number(rawPostNumber.trim());
        if (isNaN(postNumber)) {
            console.error('게시물 번호가 숫자로 변환되지 않습니다:', rawPostNumber);
            return null;
        }

        const userKeyRaw = data['작성자 ID']?.trim();
        const keyLower = userKeyRaw?.toLowerCase();
        let creatorRecord = userMap.get(keyLower);
        if (!creatorRecord && data['작성자']) {
            creatorRecord = [...userMap.values()].find(u => u.user.nickname === data['작성자'].trim());
        }

        if (!creatorRecord && keyLower) {
            console.warn(`User not found for key: "${data['작성자 ID']}" or nickname: "${data['작성자']}". Auto creating user...`);

            // 캐시에 해당 이메일이 있으면 대기
            if (this.userCreationPromises.has(keyLower)) {
                creatorRecord = await this.userCreationPromises.get(keyLower);
            } else {
                const creationPromise = (async () => {
                    // 이미 존재하는 사용자인지 확인
                    let existingUser = await this.userRepository.findOne({ where: { email: userKeyRaw } });
                    if (!existingUser) {
                        const newUser = this.userRepository.create({
                            email: userKeyRaw,
                            nickname: data['작성자']?.trim() || '',
                            role: UserRole.CREATOR, // 비즈니스 로직에 맞게 결정
                        });
                        existingUser = await this.userRepository.save(newUser);
                    }
                    // 이미 존재하는 Creator가 있는지 확인 (동일한 이메일)
                    let existingCreator = await this.creatorRepository.findOne({
                        where: { user: { email: userKeyRaw } },
                    });
                    if (!existingCreator) {
                        existingCreator = this.creatorRepository.create({
                            user: existingUser,
                            // 크리에이터 전용 필드는 필요 시 설정
                        });
                        existingCreator = await this.creatorRepository.save(existingCreator);
                    }
                    return existingCreator;
                })();
                this.userCreationPromises.set(keyLower, creationPromise);
                creatorRecord = await creationPromise;
                this.userCreationPromises.delete(keyLower);
            }
            if (creatorRecord?.user?.email) {
                userMap.set(creatorRecord.user.email.trim().toLowerCase(), creatorRecord);
            }
        }


        return {
            postNumber: Number(data['게시물 번호'].trim()),
            title: data['제목'] ? data['제목'].trim() : '제목 없음',
            url: data['URL'] ? data['URL'].trim() : '',
            createdAt: data['작성시각'] ? new Date(data['작성시각']) : null,
            views: Number(data['조회수']) || 0,
            likes: Number(data['좋아요']) || 0,
            category: this.mapContentCategory(data['카테고리']) || Category.ALL,
            location: this.formatLocation(data['위치']),
            latitude: this.parseLatitudeLongitude(data['위도']),
            longitude: this.parseLatitudeLongitude(data['경도']),
            hashtags: this.parseHashtags(data['해시태그']),
            user: {id: creatorRecord.user.id},
        };
    }


    private parseHashtags(value: string | undefined): string[] {
        if (!value || value.trim() === '') return [];

        return value
            .split(',')
            .map(tag => tag.trim()) // 앞뒤 공백 제거
            .filter(tag => tag !== ''); // 빈 문자열 제거
    }


    private parseLatitudeLongitude(value: string | undefined): number | null {

        if (!value || value.trim() === '') return null;
        const numValue = Number(value.trim());
        

        return isNaN(numValue) ? null : numValue;
    }


    private mapContentCategory(category: string | undefined): Category {
        if (!category) {
            throw new Error('카테고리 값이 비어 있습니다.');
        }

        const upperCategory = category.trim().toUpperCase();

        if (!Object.values(Category).includes(upperCategory as Category)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }

        return upperCategory as Category;
    }

    private mapBusinessCategory(category: string | undefined): BusinessCategory {
        if (!category || category.trim() === '') return BusinessCategory.ALL;
        const upperCategory = category.trim();
        if (!Object.values(BusinessCategory).includes(upperCategory as BusinessCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }
        return upperCategory as BusinessCategory;
    }

    private formatLocation(location: string | undefined): string | null {
        if (!location || location.trim() === '{}' || location.trim() === '') return null;

        return location
            .replace(/{|}/g, '')
            .replace(/"/g, '')
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url !== '')
            .join(', ');
    }

    private formatDate(dateString: string | undefined): Date | null {
        if (!dateString || dateString.trim() === '') return null;
        return new Date(dateString.trim());
    }
}
