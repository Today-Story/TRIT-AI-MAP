import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Category} from "../../common/enum/category.enum";
import {User} from "../users/user.entity";


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

    @Column({ type: 'timestamptz' })
    createdAt: Date;

    @Column({ type: 'int', default: 0 })
    views: number;

    @Column({type: 'int', default: 0 })
    likes: number;

    @Column({
        type: 'enum',
        enum: Category,
        nullable: false,
    })
    category: Category;

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
