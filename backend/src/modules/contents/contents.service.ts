import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ContentDto } from './contents.dto';
import { plainToInstance } from 'class-transformer';
import {Content, ContentCategory} from "./content.entity";

@Injectable()
export class ContentsService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) {}

    async saveContents(contents: any[]): Promise<void> {
        if (!contents.length) {
            console.log('저장할 데이터가 없습니다.');
            return;
        }
        const validContents = contents.filter(item => item !== null);
        if (validContents.length === 0) {
            console.log('유효한 데이터가 없습니다.');
            return;
        }

        try {
            console.log(`${validContents.length}개의 데이터를 저장을 시도합니다.`);

            for (const contentData of validContents) {
                // ✅ 중복 확인: 같은 제목, URL을 가진 데이터가 있는지 체크
                const existingContent = await this.contentRepository.findOne({
                    where: { title: contentData.title, url: contentData.url }
                });

                if (existingContent) {
                    console.log(`중복된 컨텐츠 발견 (ID: ${existingContent.id}) - 저장 안 함: ${contentData.title}`);
                    continue; // 중복 데이터는 저장하지 않음
                }

                // ✅ 중복되지 않은 데이터만 저장
                await this.contentRepository.insert(contentData);
            }

            console.log('CSV 데이터 저장 완료.');
        } catch (error) {
            console.error('데이터 저장 중 오류 발생:', error);
        }
    }


    // 전체 컨텐츠 조회
    async findAll(): Promise<ContentDto[]> {
        const contents = await this.contentRepository.find({ relations: ['user'] });
        return plainToInstance(ContentDto, contents, { excludeExtraneousValues: true });
    }

    // ID로 컨텐츠 조회
    async findById(id: number): Promise<ContentDto> {
        const content = await this.contentRepository.findOne({ where: { id }, relations: ['user'] });
        if (!content) {
            throw new BadRequestException(`Content with id ${id} not found`);
        }
        return plainToInstance(ContentDto, content, { excludeExtraneousValues: true });
    }

    // 카테고리별 컨텐츠 조회
    async findByCategory(category: string): Promise<ContentDto[]> {
        if (category === '전체' || category.toUpperCase() === 'ALL') {
            const contents = await this.contentRepository.find({ relations: ['user'] });
            return plainToInstance(ContentDto, contents, { excludeExtraneousValues: true });
        }
        const decodedCategory = decodeURIComponent(category);
        const categoryEnum = Object.values(ContentCategory).find(
            cat => cat === decodedCategory
        ) as ContentCategory;
        if (!categoryEnum) {
            throw new BadRequestException(`잘못된 카테고리 값: ${decodedCategory}`);
        }
        const contents = await this.contentRepository.find({
            where: { category: categoryEnum },
            relations: ['user'],
        });
        return plainToInstance(ContentDto, contents, { excludeExtraneousValues: true });
    }

    // 제목에 특정 키워드가 포함된 컨텐츠 검색
    async searchByName(name: string): Promise<ContentDto[]> {
        if (!name || name.trim() === '') {
            throw new BadRequestException('검색어를 입력해주세요.');
        }
        const searchKeyword = name.trim();
        const contents = await this.contentRepository.find({
            where: { title: ILike(`%${searchKeyword}%`) },
            relations: ['user'],
        });
        return plainToInstance(ContentDto, contents, { excludeExtraneousValues: true });
    }
}
