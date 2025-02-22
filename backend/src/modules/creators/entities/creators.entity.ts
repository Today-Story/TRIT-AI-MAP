import {Entity, Column, PrimaryGeneratedColumn, OneToMany,} from "typeorm";
import {Content} from "../../contents/content.entity";
import {UserRole} from "../../users/enums/users-role.enum";

@Entity()
export class Creators {
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

    @Column({ type: 'varchar', nullable: true})
    password: string;

    //국적
    @Column({type:'varchar', nullable: true})
    nationality: string;

    //회원가입 분류 enum
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NORMAL,
    })
    role: UserRole;

}