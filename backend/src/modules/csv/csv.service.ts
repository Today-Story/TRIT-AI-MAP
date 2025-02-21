import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { ContentCategory } from '../contents/content.entity';
import { ProductCategory } from '../products/products.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class CsvService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // 중복 생성 방지를 위한 promise 캐시
    private userCreationPromises: Map<string, Promise<User>> = new Map();

    async readUserCsv(): Promise<any[]> {
        return this.readCsvFile('user.csv', this.formatUserData.bind(this));
    }

    async readContentCsv(): Promise<any[]> {
        const users = await this.userRepository.find();
        const userMap = new Map(users.map(user => [user.userId.trim().toLowerCase(), user]));

        return this.readCsvFile('content.csv', (data) => this.formatContentData(data, userMap));
    }


    async readProductCsv(): Promise<any[]> {
        return this.readCsvFile('product.csv', this.formatProductData.bind(this));
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


    private formatUserData(data: any) {
        return {
            userId: data['트릿아이디']?.trim(),
            nickname: data['활동명(닉네임)']?.trim() || '',
            category: data['카테고리']?.trim() || '',
            youtube: data['유튜브']?.trim() || null,
            instagram: data['인스타']?.trim() || null,
            tiktok: data['틱톡']?.trim() || null,
            profilePicture: data['프로필이미지']?.trim() || null,
        };
    }

    private async formatContentData(data: any, userMap: Map<string, User>): Promise<any> {
        // 게시물 번호 검증
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

        // 작성자(유저) 매핑: 작성자 ID(소문자 기준)로 먼저 찾기
        const userKeyRaw = data['작성자 ID']?.trim();
        const keyLower = userKeyRaw?.toLowerCase();
        let user = userMap.get(keyLower);
        if (!user && data['작성자']) {
            user = [...userMap.values()].find(u => u.nickname === data['작성자'].trim());
        }

        // 유저가 없는 경우, DB에서 재조회 후 새 유저를 생성 (동시성 문제 방지)
        if (!user && keyLower) {
            console.warn(`User not found for key: "${data['작성자 ID']}" or nickname: "${data['작성자']}". Auto creating user...`);

            if (this.userCreationPromises.has(keyLower)) {
                user = await this.userCreationPromises.get(keyLower);
            } else {
                const creationPromise = (async () => {
                    let existingUser = await this.userRepository.findOne({ where: { userId: userKeyRaw } });
                    if (!existingUser) {
                        const newUser = this.userRepository.create({
                            userId: userKeyRaw,
                            nickname: data['작성자']?.trim(),
                            category: '',
                            youtube: null,
                            instagram: null,
                            tiktok: null,
                            profilePicture: null,
                        });
                        existingUser = await this.userRepository.save(newUser);
                    }
                    return existingUser;
                })();
                this.userCreationPromises.set(keyLower, creationPromise);
                user = await creationPromise;
                this.userCreationPromises.delete(keyLower);
            }
            if (user && user.userId) {
                userMap.set(user.userId.trim().toLowerCase(), user);
            }
        }

        return {
            postNumber: postNumber,
            title: data['제목']?.trim() || '제목 없음',
            url: data['URL']?.trim() || '',
            createdAt: data['작성시각'] ? new Date(data['작성시각']) : null,
            views: Number(data['조회수']) || 0,
            likes: Number(data['좋아요']) || 0,
            category: this.mapContentCategory(data['카테고리']) || ContentCategory.ALL,
            location: this.formatLocation(data['위치']),
            latitude: this.parseLatitudeLongitude(data['위도']),
            longitude: this.parseLatitudeLongitude(data['경도']),
            hashtags: this.parseHashtags(data['해시태그']),
            user: { id: user.id },
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

    private formatProductData(data: any) {
        return {
            name: data['서비스명']?.trim() || null,
            category: this.mapProductCategory(data['카테고리']),
            price: data['서비스가']?.trim() || null,
            company: data['회사명']?.trim() || null,
            contactPerson: data['담당자']?.trim() || null,
            position: data['직책']?.trim() || null,
            phone: data['전화번호']?.trim() || null,
            email: data['이메일']?.trim() || null,
            contactDate: this.formatDate(data['최종 컨택일']),
            website: data['회사홈페이지']?.trim() || null,
        };
    }

    private mapContentCategory(category: string | undefined): ContentCategory {
        if (!category) {
            throw new Error('카테고리 값이 비어 있습니다.');
        }

        const upperCategory = category.trim().toUpperCase();

        if (!Object.values(ContentCategory).includes(upperCategory as ContentCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }

        return upperCategory as ContentCategory;
    }

    private mapProductCategory(category: string | undefined): ProductCategory {
        if (!category || category.trim() === '') return ProductCategory.ALL;

        const upperCategory = category.trim();

        if (!Object.values(ProductCategory).includes(upperCategory as ProductCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }
        return upperCategory as ProductCategory;
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
