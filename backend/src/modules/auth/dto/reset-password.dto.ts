import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: '이메일 (가입된 ID)', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: '새 비밀번호', example: 'newStrongPassword123' })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
