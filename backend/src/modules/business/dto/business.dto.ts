import { BusinessCategory } from '../entities/business.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty({ description: '상품 ID' })
    id: number;

    @ApiProperty({ description: '상품명' })
    name: string;

    @ApiProperty({ description: '한글 카테고리명' })
    displayCategory: string; // 한글 카테고리

    @ApiProperty({ description: '상품 카테고리 (ENUM 값)', enum: BusinessCategory })
    category: BusinessCategory;

    @ApiProperty({ description: '가격' })
    price: string;

    @ApiProperty({ description: '회사명' })
    company: string;

    @ApiProperty({ description: '담당자' })
    contactPerson: string;

    @ApiProperty({ description: '직책' })
    position: string;

    @ApiProperty({ description: '전화번호' })
    phone: string;

    @ApiProperty({ description: '이메일' })
    email: string;

    @ApiProperty({ description: '최종 컨택일' })
    contactDate: Date;

    @ApiProperty({ description: '회사 홈페이지' })
    website: string;
}
