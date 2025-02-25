import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity()
export class CampaignApply {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Campaign, { onDelete: 'CASCADE' })
    campaign: Campaign;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 50 })
    phoneNumber: string;

    @Column({ type: 'date', nullable: true })
    birthday: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gender: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    snsAddress: string;

    @Column({ type: 'text', nullable: true })
    introduction: string;

    @Column({ type: 'text', nullable: true })
    reservationOption: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
