import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { BusinessService } from "./business.service";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {Business, BusinessCategory} from "./entities/business.entity";

@ApiTags('business')
@Controller('business')
export class BusinessController {
    constructor(private readonly productsService: BusinessService) {}

    // 전체 상품 조회
    @Get()
    @ApiOperation({ summary: '전체 상품 조회', description: '모든 상품을 조회합니다.' })
    @ApiResponse({ status: 200, description: '전체 상품 리스트 반환', type: [Business] })
    async getAllProducts(): Promise<Business[]> {
        return this.productsService.findAll();
    }

    // 상품별 검색
    @Get('/search')
    @ApiOperation({
        summary: '키워드 상품 조회',
        description: '상품명에 키워드가 포함된 상품을 검색합니다. 예: "뷰티" 입력 시 "뷰티라운지", "뷰티샵" 등 포함된 상품 반환'
    })
    @ApiQuery({
        name: 'name',
        required: true,
        description: '검색할 상품 키워드 (예: "서울", "음식")',
        example: '서울',
    })
    @ApiResponse({ status: 200, description: '검색된 상품 리스트 반환', type: [Business] })
    async searchProducts(@Query('name') name: string): Promise<Business[]> {
        const decodedName = decodeURIComponent(name);
        return this.productsService.searchByName(decodedName);
    }

    // 특정 상품 조회
    @Get(':id')
    @ApiOperation({ summary: '상품 조회', description: '상품 ID로 조회합니다.' })
    @ApiParam({ name: 'id', description: '상품 ID' })
    @ApiResponse({ status: 200, description: '상품 정보 반환', type: Business })
    async getProductById(@Param('id') id: number): Promise<Business> {
        return this.productsService.findById(id);
    }

    // 카테고리별 상품 조회
    @Get('category/:category')
    @ApiOperation({ summary: '카테고리별 상품 조회', description: '특정 카테고리의 상품을 조회합니다.' })
    @ApiParam({
        name: 'category',
        enum: BusinessCategory,
        enumName: 'ProductCategory',
        description: '상품 카테고리 ',
    })
    @ApiResponse({ status: 200, description: '해당 카테고리의 상품 리스트 반환', type: [Business] })
    async getProductsByCategory(@Param('category') category: BusinessCategory): Promise<Business[]> {
        if (!Object.values(BusinessCategory).includes(category)) {
            throw new BadRequestException(`잘못된 카테고리 값: ${category}`);
        }
        return this.productsService.findByCategory(category);
    }
}
