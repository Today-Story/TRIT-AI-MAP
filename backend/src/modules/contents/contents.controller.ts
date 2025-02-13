import {BadRequestException, Controller, Get, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ContentsService} from "./contents.service";
import {Content, ContentCategory} from "./content.entity";


@ApiTags('contents')
@Controller('contents')
export class ContentsController {
    constructor(private readonly contentsService: ContentsService) {
    }

    @Get()
    @ApiOperation({summary: '전체 컨텐츠 조회', description: '모든 컨텐츠를 조회합니다.'})
    @ApiResponse({status: 200, description: ' 전체 컨텐츠 리스트 반환', type: [Content]})
    async getAllContents(): Promise<Content[]> {
        return this.contentsService.findAll();
    }

    @Get('search')
    @ApiOperation({
        summary: '키워드 검색',
        description: '컨텐츠 제목에 키워드가 포함된 컨텐츠를 검색합니다. (예: "서울" 입력 시 "서울 여행", "서울 맛집" 등 반환)',
    })
    @ApiQuery({
        name: 'name',
        required: true,
        description: '검색할 컨텐츠 키워드 (예: "서울", "음식", "전통")'
    })
    @ApiResponse({ status: 200, description: '검색된 컨텐츠 리스트 반환', type: [Content] })
    async searchContents(@Query('name') name: string): Promise<Content[]> {
        // 검색어가 없을 경우 예외 처리
        if (!name || name.trim() === '') {
            throw new BadRequestException('검색어를 입력해주세요.');
        }

        return this.contentsService.searchByName(name);
    }

    @Get(':id')
    @ApiOperation({ summary: '컨텐츠 조회', description: '컨텐츠 ID로 조회합니다.' })
    @ApiParam({ name: 'id', description: '컨텐츠 ID' })
    @ApiResponse({ status: 200, description: '컨텐츠 정보 반환', type: Content })
    async getContentById(@Param('id') id:number): Promise<Content> {
        return this.contentsService.findById(id);
    }

    @Get('category/:category')
    @ApiOperation({summary: '카테고리별 컨텐츠 조회', description: '특정 카테고리의 컨텐츠를 조회합니다.'})
    @ApiParam({name: 'category', enum: ContentCategory, description: '컨텐츠 카테고리'})
    @ApiResponse({
        status: 200,
        description: '해당 카테고리의 컨텐츠 리스트 반환',
        type: [Content]
    }) async getContentsByCategory(@Param('category') category: string): Promise<Content[]> {
        return this.contentsService.findByCategory(category);
    }

}
