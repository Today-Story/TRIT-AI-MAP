import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class BaseSignupDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: '닉네임' })
    @IsNotEmpty()
    nickname: string;

    @ApiPropertyOptional({ example: 'MAN' })
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional({ example: '1990-01-01', format: 'date' })
    @IsOptional()
    birthday?: string;

    @ApiPropertyOptional({ example: '010-1234-5678' })
    @IsOptional()
    phoneNumber?: string;

    @ApiPropertyOptional({ example: 'Seoul, Korea' })
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: 'Korea' })
    @IsOptional()
    nationality?: string;

    @ApiPropertyOptional({
        description: '프로필 이미지 URL',
        example: 'https://s3.amazonaws.com/yourbucket/profiles/user123.jpg',
    })
    @IsOptional()
    profileImage?: string;
}
