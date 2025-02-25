import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import {Campaign} from "./entities/campaign.entity";
import {S3Module} from "../../common/s3/s3.module";

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]),
    S3Module,
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
  exports: [CampaignService],
})
export class CampaignModule {}
