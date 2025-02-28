import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from "../users/user.entity";


export enum ContentCategory {
    SHOPPING = 'SHOPPING',
    TRAVEL = 'TRAVEL',
    BEAUTY = 'BEAUTY',
    FOOD = 'FOOD',
    ALL = 'ALL',
}

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint'})
    postNumber: number;

    @Column({ type: 'varchar', length: 255})
    title: string;

    @Column({ type: 'text'})
    url: string;

    @Column({ type: 'text', nullable: true })
    imageUrl: string;

    @Column({ type: 'text', nullable: true })
    videoUrl: string;

    @Column({ type: 'timestamptz' })
    createdAt: Date;

    @Column({ type: 'int', default: 0 })
    views: number;

    @Column({type: 'int', default: 0 })
    likes: number;

    @Column({
        type: 'enum',
        enum: ContentCategory,
        nullable: false,
    })
    category: ContentCategory;

    @Column({ type: 'text', nullable: true })
    location: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitude: number;

    @Column({ type: 'simple-array', nullable: true })
    hashtags: string[];

    @ManyToOne(() => User, (user) => user.contents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

}
