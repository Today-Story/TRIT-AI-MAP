import {Entity, Column, PrimaryGeneratedColumn, OneToMany,} from "typeorm";
import {Content} from "../contents/content.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length:255, unique: true})
    userId: string;

    @Column({ type: 'varchar', length: 255})
    nickname: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    category: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    youtube: string;  // 유튜브 URL

    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram: string;  // 인스타그램 URL

    @Column({ type: 'varchar', length: 255, nullable: true })
    tiktok: string;  // 틱톡 URL

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;

    @OneToMany(() => Content, (content) => content.user)
    contents: Content[];

}