import {Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn,} from "typeorm";
import {Content} from "../../contents/content.entity";
import {User} from "../../users/user.entity";



@Entity()
export class Creator {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ type: 'varchar', length: 255, nullable: true })
    category: string;

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