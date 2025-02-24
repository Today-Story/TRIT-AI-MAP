import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentsService } from './contents.service';
import { ContentDto } from './contents.dto';
import {Category} from "../../common/enum/category.enum";

@ApiTags('contents')
@Controller('contents')
export class ContentsController {
    constructor(private readonly contentsService: ContentsService) {}

    @ApiOperation({ summary: '전체 컨텐츠 조회', description: '모든 컨텐츠를 조회합니다.' })
    @ApiResponse({ status: 200, description: '전체 컨텐츠 리스트 반환', type: [ContentDto] })
    @Get()
    async getAllContents(): Promise<ContentDto[]> {
        return this.contentsService.findAll();
    }

    @ApiOperation({
        summary: '키워드 검색',
        description: '컨텐츠 제목에 키워드가 포함된 컨텐츠를 검색합니다. (예: "서울")',
    })
    @ApiQuery({ name: 'name', required: true, description: '검색할 컨텐츠 키워드 (예: "서울", "음식")' })
    @ApiResponse({ status: 200, description: '검색된 컨텐츠 리스트 반환', type: [ContentDto] })
    @Get('search')
    async searchContents(@Query('name') name: string): Promise<ContentDto[]> {
        if (!name || name.trim() === '') {
            throw new BadRequestException('검색어를 입력해주세요.');
        }
        return this.contentsService.searchByName(name);
    }

    @ApiOperation({ summary: '컨텐츠 조회', description: '컨텐츠 ID로 조회합니다.' })
    @ApiParam({ name: 'id', description: '컨텐츠 ID' })
    @ApiResponse({ status: 200, description: '컨텐츠 정보 반환', type: ContentDto })
    @Get(':id')
    async getContentById(@Param('id') id: number): Promise<ContentDto> {
        return this.contentsService.findById(id);
    }

    @ApiOperation({ summary: '카테고리별 컨텐츠 조회', description: '특정 카테고리의 컨텐츠를 조회합니다.' })
    @ApiParam({ name: 'category', enum: Category, description: '컨텐츠 카테고리' })
    @ApiResponse({ status: 200, description: '해당 카테고리의 컨텐츠 리스트 반환', type: [ContentDto] })
    @Get('category/:category')
    async getContentsByCategory(@Param('category') category: string): Promise<ContentDto[]> {
        return this.contentsService.findByCategory(category);
    }
}
