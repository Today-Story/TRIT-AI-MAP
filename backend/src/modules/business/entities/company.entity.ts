import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/user.entity";
import {Category} from "../../../common/enum/category.enum";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    companyName: string;

    @Column({ nullable: true })
    companyLogo: string;

    @Column({ nullable: true })
    companySns: string;

    @Column({ nullable: true })
    introduction: string;

    @Column({
        type: 'enum',
        enum: Category,
        nullable: true,
    })
    category: Category;
}
