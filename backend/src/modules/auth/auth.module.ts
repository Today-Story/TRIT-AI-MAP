// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../users/entities/user.entity";
import {AuthService} from "./services/auth.service";
import {AuthController} from "./controllers/auth.controller";
import {S3Module} from "../s3/s3.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
      S3Module,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
