import {Module, OnModuleInit} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {CsvService} from "../csv/csv.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CsvService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly userService: UsersService) {}

  async onModuleInit() {
    console.log('CSV 데이터 마이그레이션 (users)');
    await this.userService.saveUsers();
  }
}