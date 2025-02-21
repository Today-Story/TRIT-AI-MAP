// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthService} from "./services/auth.service";
import {AuthController} from "./controllers/auth.controller";
import {S3Module} from "../s3/s3.module";
import {Creators} from "../creators/entities/creators.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Creators]),
      S3Module,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
