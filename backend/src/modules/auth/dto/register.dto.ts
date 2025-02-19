import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class RegisterUserDto {
    @ApiProperty({ description: '이메일', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: '비밀번호', example: 'securepassword123' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: '닉네임', example: '닉네임123' })
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @ApiProperty({ description: '프로필 이미지 URL', required: false })
    @IsOptional()
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
    @IsOptional()
    role?: UserRole;
}
