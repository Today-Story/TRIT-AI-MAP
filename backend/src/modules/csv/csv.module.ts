import { Module } from '@nestjs/common';
import { CsvService} from "./csv.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Content} from "../contents/content.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/user.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Content, Product, User]),
        UsersModule,
    ],
    providers: [CsvService],
    exports: [CsvService, TypeOrmModule],
})
export class CsvModule {}
