import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { AuthUserDto } from '../dto/auth-user.dto';
import * as bcrypt from 'bcryptjs';
import {User} from '../../users/user.entity';
import {Creator} from "../../creators/entities/creators.entity";
import {Company} from "../../business/entities/company.entity";
import {CreatorSignupDto} from "../dto/singup/creator-signup.dto";
import {CompanySignupDto} from "../dto/singup/company-signup.dto";
import {NomalSinupDto} from "../dto/singup/nomal-sinup.dto";
import {UserRole} from "../../users/enums/users-role.enum";

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Creator)
      private readonly creatorRepository: Repository<Creator>,
      @InjectRepository(Company)
      private readonly companyRepository: Repository<Company>,
  ) {}

  async registerCreator(dto: CreatorSignupDto, role: UserRole): Promise<User> {
    const { email, password, nickname, category, profileImage } = dto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1) 공통 User 생성 (UserCategory 저장)
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      gender: dto.gender,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      nationality: dto.nationality,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      profileImage: profileImage,
      role,
    });
    const savedUser = await this.userRepository.save(user);


    // 2) Creator 엔티티 생성 (CreatorCategory 저장)
    const creator = this.creatorRepository.create({
      category: category || "",
      introduction: dto.introduction,
      youtube: dto.youtube,
      instagram: dto.instagram,
      tiktok: dto.tiktok,
      user: savedUser,
    });

    await this.creatorRepository.save(creator);
    return savedUser;
  }


  async registerCompany(dto: CompanySignupDto, role: UserRole): Promise<User> {
    const { email, password, nickname, category, profileImage } = dto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      gender: dto.gender,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      nationality: dto.nationality,
      role,
      profileImage: profileImage,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
    });
    const savedUser = await this.userRepository.save(user);

    const company = this.companyRepository.create({
      user: savedUser,
      companyName: dto.companyName,
      companySns: dto.companySns,
      introduction: dto.introduction,
      category: category || "",
    });

    await this.companyRepository.save(company);
    return savedUser;
  }


  async registerNormalUser(dto: NomalSinupDto, role: UserRole): Promise<User> {
    const { email, password, nickname, profileImage } = dto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      gender: dto.gender,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      nationality: dto.nationality,
      role,
      profileImage: profileImage, // 업로드된 이미지 URL 저장
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto, req: Request): Promise<AuthUserDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    req.session.userId = user.id;
    req.session.userRole = user.role;

    return plainToInstance(AuthUserDto, user, { excludeExtraneousValues: true });
  }
}
