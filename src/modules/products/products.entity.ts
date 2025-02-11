import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ProductCategory {
    OUTDOOR = '아웃도어',
    INDOOR = '인도어',
    BEAUTY = '뷰티서비스',
    FOOD = '푸드',
    RENTAL = '렌탈서비스',
    ACCESSORY = '의류/액세서리',
    APPLICATION = '어플리케이션',
    ALL = '전체',
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'enum', enum: ProductCategory, nullable: true, default: ProductCategory.ALL })
    category: ProductCategory;

    @Column({type: 'varchar', length: 255, nullable: true})
    price: string;

    @Column({type: 'varchar', length:255, nullable:true})
    company: string;

    @Column({type:'varchar', length:255, nullable:true})
    contactPerson: string;

    @Column({type: 'varchar', length: 255, nullable:true})
    position: string;

    @Column({type: 'varchar', length: 50, nullable:true})
    phone: string;

    @Column({type: 'varchar', length: 255, nullable:true})
    email: string;

    @Column({type: 'date', nullable:true})
    contactDate: Date;

    @Column({type: 'varchar', length: 500, nullable:true})
    website: string;


}
