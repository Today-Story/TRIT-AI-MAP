import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from "typeorm";
import { Product, ProductCategory } from "./products.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    )
    {}

    async saveProducts(products: any[]): Promise<void> {
        if (!products.length) {
            console.log('저장할 데이터가 없습니다.');
            return;
        }

        try {
            for (let index = 0; index < products.length; index++) {
                const data = products[index];

                const existingProduct = await this.productRepository.findOne({
                    where: { name: data.name, company: data.company },
                });

                if (!existingProduct) {
                    const productEntity = this.productRepository.create({
                        ...data,
                        id: index + 1,
                    });

                    await this.productRepository.save(productEntity);
                }
            }

            console.log('CSV 데이터 저장 완료.');
        } catch (error) {
            console.error('데이터 저장 중 오류 발생:', error);
        }
    }

}
