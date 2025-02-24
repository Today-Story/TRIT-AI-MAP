import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { UserRole } from '../../users/enums/users-role.enum';
import { AuthUserDto } from '../dto/auth-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/user.entity';
import {Creator} from "../../creators/entities/creators.entity";
import {Company} from "../../business/entities/company.entity";
import {CreatorSignupDto} from "../dto/singup/creator-signup.dto";
import {CompanySignupDto} from "../dto/singup/company-signup.dto";
import {NomalSinupDto} from "../dto/singup/nomal-sinup.dto";

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

  async registerCreator(dto: CreatorSignupDto): Promise<User> {
    const { email, password, nickname } = dto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1) 공통 User 생성
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      gender: dto.gender,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      nationality: dto.nationality,
      role: UserRole.CREATOR,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      profileImage: dto.profileImage,
    });
    const savedUser = await this.userRepository.save(user);

    // 2) Creator 엔티티 생성
    const creator = this.creatorRepository.create({
      user: savedUser,
      introduction: dto.introduction,
      category: dto.category,
      youtube: dto.youtube,
      instagram: dto.instagram,
      tiktok: dto.tiktok,
    });
    await this.creatorRepository.save(creator);

    return savedUser;
  }

  async registerCompany(dto: CompanySignupDto): Promise<User> {
    const { email, password, nickname } = dto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1) 공통 User 생성
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      address: dto.address,
      nationality: dto.nationality,
      role: UserRole.BUSINESS,
    });
    const savedUser = await this.userRepository.save(user);

    // 2) Company 엔티티 생성
    const company = this.companyRepository.create({
      user: savedUser,
      companyName: dto.companyName,
      companySns: dto.companySns,
      introduction: dto.introduction,
      category: dto.category,
    });
    await this.companyRepository.save(company);

    return savedUser;
  }

  async registerNormalUser(dto: NomalSinupDto): Promise<User> {
    const { email, password, nickname } = dto;

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
      role: UserRole.NORMAL,
      profileImage: dto.profileImage,
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
