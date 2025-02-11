import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { Content } from './content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])], // Content 엔티티 추가
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [TypeOrmModule],
})
export class ContentsModule {}
