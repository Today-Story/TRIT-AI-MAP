import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import {Business} from '../business/entities/business.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Creator} from "../creators/entities/creators.entity";
import {User} from "../users/user.entity";
import {Content} from "../contents/content.entity";

@Injectable()
export class CsvService {
    constructor(
        @InjectRepository(Creator)
        private readonly creatorRepository: Repository<Creator>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
    ) {
    }

    async readUserCsv(): Promise<any[]> {
        return this.readCsvFile('user.csv', this.formatCreatorData.bind(this));
    }

    async readContentCsv(): Promise<any[]> {
        const creators = await this.creatorRepository.find({ relations: ['user'] });
        const validCreators = creators.filter(creator => creator.user && creator.user.email);
        const userMap = new Map(validCreators.map(creator => [creator.user.email.trim().toLowerCase(), creator]));
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
            const cleanKey = key.replace(/\ufeff/g, '').trim();
            normalizedData[cleanKey] = data[key]?.toString().replace(/\ufeff/g, '').trim();
        });
        return normalizedData;
    }

    private formatCreatorData(data: any) {
        return {
            userData: {
                gender: data['성별'] ? data['성별'].trim() : null,
                nickname: data['활동명(닉네임)'] ? data['활동명(닉네임)'].trim() : '',
                email: data['트릿아이디'] ? data['트릿아이디'].trim() : '',
            },
            creatorData: {
                category: data['카테고리'] ? data['카테고리'].trim() : "",
                youtube: data['유튜브'] || null,
                instagram: data['인스타'] || null,
                tiktok: data['틱톡'] || null,
                profileImage: data['프로필이미지'] ? data['프로필이미지'].trim() : null,
                introduction: data['소개'] || null,
            },
        };
    }

    private formatBusinessData(data: any) {
        return {
            name: data['서비스명']?.trim() || null,
            category: data['카테고리']?.trim() || "",
            company: data['회사명']?.trim() || null,
            phone: data['전화번호']?.trim() || null,
            price: data['서비스가']?.trim() || null,
            contactPerson: data['담당자']?.trim() || null,
            website: data['회사홈페이지']?.trim() || null,
        };
    }

    private async formatContentData(data: any, userMap: Map<string, Creator>): Promise<any> {
        if (!data['게시물 번호']?.trim()) {
            console.warn('게시물 번호 값이 누락되어 건너뜁니다:', data);
            return null;
        }

        const rawPostNumber = data['게시물 번호'];
        const postNumber = Number(rawPostNumber.trim());
        if (isNaN(postNumber)) {
            console.error('게시물 번호가 숫자로 변환되지 않습니다:', rawPostNumber);
            return null;
        }

        // 작성자(크리에이터) 매핑: CSV의 작성자 ID를 사용 (소문자 기준)
        const userKeyRaw = data['작성자 ID']?.trim();
        if (!userKeyRaw) {
            console.warn('작성자 ID가 없습니다. 건너뜁니다:', data);
            return null;
        }
        const keyLower = userKeyRaw.toLowerCase();
        const creator = userMap.get(keyLower);
        if (!creator) {
            console.warn(`매핑되지 않은 작성자 ID: "${userKeyRaw}"`, data);
            return null; // 작성자를 찾지 못하면 해당 컨텐츠는 저장하지 않음.
        }

        return {
            postNumber: postNumber,
            title: data['제목']?.trim() || '제목 없음',
            url: data['URL']?.trim() || '',
            createdAt: data['작성시각'] ? new Date(data['작성시각']) : null,
            views: Number(data['조회수']) || 0,
            likes: Number(data['좋아요']) || 0,
            category: data['카테고리']?.trim() || "",
            hashtags: this.parseHashtags(data['해시태그']),
            location: this.formatLocation(data['위치']),
            latitude: this.parseLatitudeLongitude(data['위도']),
            longitude: this.parseLatitudeLongitude(data['경도']),
            user: { id: creator.user.id }, // 연결된 User의 id로 매핑
        };
    }




    private parseHashtags(value: string | undefined): string[] {
        if (!value || value.trim() === '') return [];
        return value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }

    private parseLatitudeLongitude(value: string | undefined): number | null {
        if (!value || value.trim() === '') return null;
        const numValue = Number(value.trim());
        return isNaN(numValue) ? null : numValue;
    }

    private formatLocation(location: string | undefined): string | null {
        if (!location || location.trim() === '{}' || location.trim() === '') return null;
        return location.replace(/{|}/g, '').replace(/"/g, '').split(',').map(url => url.trim()).filter(url => url !== '').join(', ');
    }

    private formatDate(dateString: string | undefined): Date | null {
        if (!dateString || dateString.trim() === '') return null;
        return new Date(dateString.trim());
    }

}
