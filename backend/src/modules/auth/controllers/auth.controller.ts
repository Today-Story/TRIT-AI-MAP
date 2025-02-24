
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { S3Service } from '../../../common/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../users/user.entity';
import { AuthUserDto } from '../dto/auth-user.dto';
import { CreatorSignupDto } from '../dto/singup/creator-signup.dto';
import { CompanySignupDto } from '../dto/singup/company-signup.dto';
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors} from "@nestjs/common";
import {LoginDto} from "../dto/login.dto";
import {NomalSinupDto} from "../dto/singup/nomal-sinup.dto"; // 일반회원가입 DTO

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly s3Service: S3Service,
  ) {}


  @Post('signup/creator')
  @ApiOperation({
    summary: '크리에이터 회원가입',
    description:
        '크리에이터 회원가입을 진행합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'creator@example.com' },
        password: { type: 'string', example: 'password123' },
        nickname: { type: 'string', example: '크리에이터닉네임' },
        gender: { type: 'string', example: 'MAN' },
        birthday: { type: 'string', format: 'date', example: '1990-01-01' },
        phoneNumber: { type: 'string', example: '010-1234-5678' },
        address: { type: 'string', example: 'Seoul, Korea' },
        nationality: { type: 'string', example: 'Korea' },
        profileImage: { type: 'string', format: 'binary' },
        introduction: {
          type: 'string',
          example: '안녕하세요, 영상 제작자입니다.',
        },
        category: {
          type: 'string',
          enum: ['SHOPPING', 'TRAVEL', 'BEAUTY', 'FOOD'],
          example: 'TRAVEL',
        },
        youtube: {
          type: 'string',
          example: 'https://www.youtube.com/@channel',
        },
        instagram: {
          type: 'string',
          example: 'https://www.instagram.com/username',
        },
        tiktok: {
          type: 'string',
          example: 'https://www.tiktok.com/@username',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async registerCreator(
      @Body() dto: CreatorSignupDto,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
  ): Promise<User> {
    if (file) {
      dto.profileImage = await this.s3Service.uploadFile(file, 'profile', 'creator');
    }
    const user = await this.authService.registerCreator(dto);
    req.session.userId = user.id;
    req.session.userRole = user.role;
    return user;
  }


  @Post('signup/company')
  @ApiOperation({
    summary: '기업 회원가입',
    description:
        '기업 회원가입을 진행합니다.'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'company@example.com' },
        password: { type: 'string', example: 'password123' },
        nickname: { type: 'string', example: '기업닉네임' },
        address: { type: 'string', example: 'Seoul, Korea' },
        nationality: { type: 'string', example: 'Korea' },
        profileImage: { type: 'string', format: 'binary' },
        companyName: { type: 'string', example: 'ABC 회사' },
        companySns: {
          type: 'string',
          example: 'https://www.instagram.com/company',
        },
        introduction: { type: 'string', example: '우리 회사는 ...' },
        category: {
          type: 'string',
          enum: ['SHOPPING', 'TRAVEL', 'BEAUTY', 'FOOD'],
          example: 'BEAUTY',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async registerCompany(
      @Body() dto: CompanySignupDto,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
  ): Promise<User> {
    if (file) {
      dto.profileImage = await this.s3Service.uploadFile(file, 'profile', 'company');
    }
    const user = await this.authService.registerCompany(dto);
    req.session.userId = user.id;
    req.session.userRole = user.role;
    return user;
  }


  @Post('signup/user')
  @ApiOperation({
    summary: '일반 회원가입',
    description: '일반 회원가입을 진행합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        nickname: { type: 'string', example: '일반닉네임' },
        gender: { type: 'string', example: 'WOMAN' },
        birthday: { type: 'string', format: 'date', example: '1995-05-05' },
        phoneNumber: { type: 'string', example: '010-9876-5432' },
        address: { type: 'string', example: 'Busan, Korea' },
        nationality: { type: 'string', example: 'Korea' },
        profileImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async registerNormalUser(
      @Body() dto: NomalSinupDto,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
  ): Promise<User> {
    if (file) {
      dto.profileImage = await this.s3Service.uploadFile(file, 'profile', 'nomal');
    }
    const user = await this.authService.registerNormalUser(dto);
    req.session.userId = user.id;
    req.session.userRole = user.role;
    return user;
  }


  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호를 이용하여 로그인하고 세션을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthUserDto,
  })
  async login(
      @Body() loginDto: LoginDto,
      @Req() req: Request,
  ): Promise<AuthUserDto> {
    const authUser = await this.authService.login(loginDto, req);
    return authUser;
  }


  @Get('session')
  @ApiOperation({
    summary: '세션 조회',
    description: '현재 로그인된 사용자의 세션 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '현재 로그인된 사용자 정보',
    schema: {
      example: { userId: 1, role: 'CREATOR' },
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인 상태가 아닙니다.',
    schema: {
      example: { message: '로그인 상태가 아닙니다.' },
    },
  })
  getSession(@Req() req: Request) {
    if (!req.session.userId) {
      return { message: '로그인 상태가 아닙니다.' };
    }
    return { userId: req.session.userId, role: req.session.userRole };
  }


  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '세션을 종료하여 로그아웃합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 완료',
    schema: { example: { message: '로그아웃 완료' } },
  })
  async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new BadRequestException('로그아웃 실패'));
        }
        resolve({ message: '로그아웃 완료' });
      });
    });
  }
}
