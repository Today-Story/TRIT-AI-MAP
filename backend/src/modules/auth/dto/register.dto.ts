import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class RegisterUserDto {
    @ApiProperty({ description: '이메일', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: '비밀번호', example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: '닉네임', example: '닉네임123' })
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @ApiPropertyOptional({ description: '프로필 이미지 (파일 업로드)' })
    @IsOptional()
    @IsString()
    profilePicture?: string;

    @ApiProperty({ description: '국적', example: 'Korea' })
    @IsNotEmpty()
    @IsString()
    nationality: string;

    @ApiProperty({
        description: '사용자 역할 (선택 가능: CREATOR, BUSINESS, NORMAL, ADMIN)',
        enum: UserRole,
        example: UserRole.CREATOR,
    })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role?: UserRole;
}
