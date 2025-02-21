import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { UserRole } from '../../users/enums/users-role.enum';
import { AuthUserDto } from '../dto/auth-user-dto';
import * as bcrypt from 'bcryptjs';
import {Creators} from "../../creators/entities/creators.entity";  // ✅ `bcryptjs` 사용


@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(Creators)
      private readonly userRepository: Repository<Creators>,
  ) {}

  async register(registerUserDto: RegisterUserDto, req: Request): Promise<AuthUserDto> {
    const { email, password, nickname, profilePicture, nationality, role } = registerUserDto;

    // 이메일 중복 체크 (`userId` = `email`로 저장)
    const existingUser = await this.userRepository.findOne({ where: { userId: email } });

    if (existingUser) {
      throw new BadRequestException({
        message: '이미 가입된 이메일입니다. 로그인하거나 비밀번호를 재설정하세요.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      userId: email,
      password: hashedPassword,
      nickname,
      profilePicture,
      nationality,
      role: role || UserRole.NORMAL,
    });

    const savedUser = await this.userRepository.save(user);

    req.session.userId = savedUser.id;
    req.session.userRole = savedUser.role;

    return plainToInstance(AuthUserDto, savedUser, { excludeExtraneousValues: true });
  }

  async login(loginDto: LoginDto, req: Request): Promise<AuthUserDto> {
    const { email, password } = loginDto;

    // 이메일(`userId`)로 사용자 찾기
    const user = await this.userRepository.findOne({ where: { userId: email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;

    return plainToInstance(AuthUserDto, user, { excludeExtraneousValues: true });
  }
}
