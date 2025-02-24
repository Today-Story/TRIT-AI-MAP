import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthService} from "./services/auth.service";
import {AuthController} from "./controllers/auth.controller";
import {S3Module} from "../../common/s3/s3.module";
import {Creator} from "../creators/entities/creators.entity";
import {User} from "../users/user.entity";
import {Company} from "../business/entities/company.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Creator, Company]),
      S3Module,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
