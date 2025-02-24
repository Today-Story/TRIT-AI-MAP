import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { UserRole } from "./enums/users-role.enum";
import {Content} from "../contents/content.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    nickname: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gender: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileImage: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'date', nullable: true })
    birthday: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nationality: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NORMAL,
    })
    role: UserRole;

    @OneToMany(() => Content, (content) => content.user)
    contents: Content[];
}
