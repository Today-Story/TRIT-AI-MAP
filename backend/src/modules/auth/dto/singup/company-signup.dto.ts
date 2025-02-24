import { ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';
import {BaseSignupDto} from "./base-signup.dto";

export class CompanySignupDto extends BaseSignupDto {
    @ApiPropertyOptional({
        description: '기업명',
        example: 'ABC 회사',
    })
    @IsOptional()
    companyName?: string;

    @ApiPropertyOptional({
        description: '기업용 SNS 링크',
        example: 'https://www.instagram.com/company',
    })
    @IsOptional()
    companySns?: string;

    @ApiPropertyOptional({
        description: '기업 한줄 소개',
        example: '우리 회사는 ...',
    })
    @IsOptional()
    introduction?: string;

    @ApiPropertyOptional({
        description: '기업 전용 카테고리',
    })
    @IsOptional()
    @IsString()
    category?: string;
}