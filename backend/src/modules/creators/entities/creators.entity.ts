import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Content } from "../../contents/content.entity";
import {User} from "../../users/user.entity";
import {Category} from "../../../common/enum/category.enum";

@Entity()
export class Creator {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({
        type: 'enum',
        enum: Category,
        nullable: false,
    })
    category: Category;

    @Column({ type: 'varchar', length: 255, nullable: true })
    youtube: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tiktok: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    introduction: string;

    @OneToMany(() => Content, (content) => content.user)
    contents: Content[];
}
