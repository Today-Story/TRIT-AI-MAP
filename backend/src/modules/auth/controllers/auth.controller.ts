import {Controller, Post, Body, Req, Get, UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { Request } from 'express';
import { RegisterUserDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthUserDto } from '../dto/auth-user-dto';
import {S3Service} from "../../s3/s3.service";
import {UserRole} from "../../users/enums/user-role.enum";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 201, description: '회원가입 완료', type: AuthUserDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        nickname: { type: 'string', example: '닉네임123' },
        nationality: { type: 'string', example: 'Korea' },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          example: UserRole.CREATOR,
        },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('signup')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async register(
      @Req() req: Request,
      @Body() registerDto: RegisterUserDto,
      @UploadedFile() file?: Express.Multer.File,
  ): Promise<AuthUserDto> {

    if (!registerDto) {
      throw new BadRequestException('회원가입 데이터가 전달되지 않았습니다.');
    }

    if (file) {
      registerDto.profilePicture = await this.s3Service.uploadFile(file, 'profile', 'creator');
    }

    return this.authService.register(registerDto, req);
  }




  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 완료', type: AuthUserDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthUserDto> {
    return this.authService.login(loginDto, req);
  }

  @ApiOperation({ summary: '현재 로그인된 사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '현재 로그인된 사용자 정보',
    schema: {
      example: {
        userId: 1,
        role: 'CREATOR',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인 상태가 아닙니다.',
    schema: {
      example: { message: '로그인 상태가 아닙니다.' },
    },
  })
  @Get('session')
  getSession(@Req() req: Request) {
    if (!req.session.userId) {
      return { message: '로그인 상태가 아닙니다.' };
    }
    return { userId: req.session.userId, role: req.session.userRole };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: { example: { message: '로그아웃 완료' } },
  })
  @Post('logout')
  async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new Error('로그아웃 실패'));
        } else {
          resolve({ message: '로그아웃 완료' });
        }
      });
    });
  }
}
