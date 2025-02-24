import {ApiPropertyOptional} from '@nestjs/swagger';
import { IsOptional} from 'class-validator';
import {BaseSignupDto} from "./base-signup.dto";

export class CreatorSignupDto extends BaseSignupDto {
    @ApiPropertyOptional({
        description: '크리에이터 한줄 소개',
        example: '안녕하세요, 영상 제작자입니다.',
    })
    @IsOptional()
    introduction?: string;

    @ApiPropertyOptional({
        description: '크리에이터 카테고리',
    })
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({
        description: '유튜브 URL',
        example: 'https://www.youtube.com/@channel',
    })
    @IsOptional()
    youtube?: string;

    @ApiPropertyOptional({
        description: '인스타그램 URL',
        example: 'https://www.instagram.com/username',
    })
    @IsOptional()
    instagram?: string;

    @ApiPropertyOptional({
        description: '틱톡 URL',
        example: 'https://www.tiktok.com/@username',
    })
    @IsOptional()
    tiktok?: string;
}