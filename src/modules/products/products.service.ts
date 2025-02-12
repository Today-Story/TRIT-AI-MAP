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


    //전체 상품 조회
    async findAll(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    //ID로 조회
    async findById(id: number): Promise<Product | null> {
        return await this.productRepository.findOne({where: {id}});
    }

    //카테고리 별 조회
    async findByCategory(category: string): Promise<Product[]> {

        const categoryEnum = Object.values(ProductCategory).find(cat => cat === category) as ProductCategory;

        if (!categoryEnum) {
            throw new Error(`잘못된 카테고리 값: ${category}`);
        }
        return await this.productRepository.find({
            where: { category: categoryEnum },
        });
    }

    //상품 별 조회
    async searchByName(name: string): Promise<Product[]> {
        return await this.productRepository
            .createQueryBuilder('product')
            .where('product.name ILIKE :name', { name: `%${name}%`})
            .getMany();
    }
}
