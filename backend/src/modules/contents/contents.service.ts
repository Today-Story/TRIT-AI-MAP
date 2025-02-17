import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {Content, ContentCategory} from './content.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ContentsService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async saveContents(contents: any[]): Promise<void> {
        if (!contents.length) {
            console.log('저장할 데이터가 없습니다.');
            return;
        }
        try {
            console.log(`${contents.length}개의 데이터를 저장합니다.`);

            const validContents = [];

            for (const item of contents) {
                const user = await this.userRepository.findOne({ where: { userId: item.userId } });
                if (!user) {
                    console.log(`User not found for userId: ${item.userId}`);
                    continue; // 해당 데이터는 저장하지 않음
                }
                item.userId = user.id; // userId를 실제 DB ID로 변환
                item.postNumber = item.postNumber ?? 0; // null 방지
                validContents.push(item);
            }

            if (validContents.length === 0) {
                console.log('유효한 데이터가 없습니다.');
                return;
            }

            await this.contentRepository.insert(validContents);

            console.log('CSV 데이터 저장 완료.');
        } catch (error) {
            console.log('데이터 저장 중 오류 발생:', error);
        }
    }


    //전체조회
    async findAll(): Promise<Content[]> {
        return await this.contentRepository.find();
    }

    // 특정 id로 조회
    async findById(id:number): Promise<Content | null> {
        return await this.contentRepository.findOne({where: {id}});
    }

    //카테고리 조회
    async findByCategory(category: string): Promise<Content[]> {
        if (category === '전체' || category.toUpperCase() === 'ALL') {
            return await this.contentRepository.find();
        }

        const decodedCategory = decodeURIComponent(category);

        const categoryEnum = Object.values(ContentCategory).find(category => category === decodedCategory) as ContentCategory;

        if (!categoryEnum) {
            throw new Error(`잘못된 카테고리 값: ${decodedCategory}`);
        }

        return await this.contentRepository.find({
            where: {category: categoryEnum},
        });
    }

    // 제목에 특정 키워드가 포함된 컨텐츠 검색
    async searchByName(name: string): Promise<Content[]> {
        // 입력값 검증 (빈 값일 경우 예외 처리)
        if (!name || name.trim() === '') {
            throw new Error('검색어를 입력해주세요.');
        }

        // 불필요한 공백 제거 후 검색
        const searchKeyword = name.trim();

        return await this.contentRepository.find({
            where: { title: ILike(`%${searchKeyword}%`) }, // ILike: 대소문자 구분 없이 검색
        });
    }
}