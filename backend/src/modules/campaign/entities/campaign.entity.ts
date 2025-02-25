import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    // 브랜드(업체) 이름
    @Column({ type: 'varchar', length: 255 })
    brandName: string;

    // 캠페인 섬네일 이미지 URL
    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    // 캠페인 신청 기간
    @Column({ type: 'date', nullable: true })
    applicationStart: Date;

    @Column({ type: 'date', nullable: true })
    applicationEnd: Date;

    // 크리에이터 선정 기간
    @Column({ type: 'date', nullable: true })
    selectionStart: Date;

    @Column({ type: 'date', nullable: true })
    selectionEnd: Date;

    // 크리에이터 발표 날짜
    @Column({ type: 'date', nullable: true })
    announcement: Date;

    // 캠페인 결과 발표 날짜
    @Column({ type: 'date', nullable: true })
    resultAnnouncement: Date;

    // 모집 인원
    @Column({ type: 'int', nullable: true })
    people: number;

    // 비디오 길이 (최소, 최대)
    @Column({ type: 'int', nullable: true })
    videoMin: number;

    @Column({ type: 'int', nullable: true })
    videoMax: number;

    // 업로드할 SNS 플랫폼 목록 (예: ['YOUTUBE', 'INSTAGRAM'])
    @Column({ type: 'simple-array', nullable: true })
    sns: string[];

    // 미션 텍스트 (크리에이터에게 요구사항)
    @Column({ type: 'text', nullable: true })
    missionText: string;

    // 상품 상세 (자유 기입)
    @Column({ type: 'text', nullable: true })
    productDetail: string;

    // 리워드: 크레딧과 추가 리워드(자유 기입)
    @Column({ type: 'text', nullable: true })
    rewardCredit: string;

    @Column({ type: 'text', nullable: true })
    rewardAdditional: string;

    // 유의 사항
    @Column({ type: 'text', nullable: true })
    notes: string;

    // 방문 및 예약 정보
    @Column({ type: 'text', nullable: true })
    location: string;

    @Column({ type: 'text', nullable: true })
    reserveTime: string;

    @Column({ type: 'text', nullable: true })
    visitTime: string;

    // 진행 상태 (예: PENDING, ACTIVE, COMPLETED 등)
    @Column({ type: 'varchar', length: 50, default: 'PENDING' })
    status: string;

    @CreateDateColumn({ type: 'date' })
    createdAt: Date;
}
