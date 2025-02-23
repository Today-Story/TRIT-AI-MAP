import { Module } from '@nestjs/common';
import { CsvService} from "./csv.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Content} from "../contents/content.entity";
import {CreatorsModule} from "../creators/creators.module";
import {Business} from "../business/business.entity";
import {Creators} from "../creators/entities/creators.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Content, Business, Creators]),
        CreatorsModule,
    ],
    providers: [CsvService],
    exports: [CsvService, TypeOrmModule],
})
export class CsvModule {}
