import { ApiProperty } from '@nestjs/swagger';
import {Expose} from "class-transformer";

export class CreateCampaignDto {
    @ApiProperty({ description: '캠페인 ID' })
    id: number;

    @ApiProperty({ description: '캠페인 타이틀', example: '신제품 런칭 캠페인' })
    title: string;

    @ApiProperty({ description: '브랜드(업체) 이름', example: 'ABC Company' })
    brandName: string;

    @ApiProperty({ description: '썸네일 이미지', required: false })
    image?: string;

    @ApiProperty({ description: '신청 시작일', example: '2025-03-01' })
    applicationStart: Date;

    @ApiProperty({ description: '신청 종료일', example: '2025-03-10' })
    applicationEnd: Date;

    @ApiProperty({ description: '크리에이터 선정 시작일', example: '2025-03-11' })
    selectionStart: Date;

    @ApiProperty({ description: '크리에이터 선정 종료일', example: '2025-03-15' })
    selectionEnd: Date;

    @ApiProperty({ description: '크리에이터 발표일', example: '2025-03-16' })
    announcement: Date;

    @ApiProperty({ description: '캠페인 결과 발표일', example: '2025-03-20' })
    resultAnnouncement: Date;

    @ApiProperty({ description: '모집 인원', example: 50 })
    people: number;

    @ApiProperty({ description: '비디오 최소 길이', example: 30 })
    videoMin: number;

    @ApiProperty({ description: '비디오 최대 길이', example: 120 })
    videoMax: number;

    @ApiProperty({ description: '업로드할 SNS 플랫폼 목록', example: 'youtube, instagram' })
    sns: string;

    @ApiProperty({ description: '미션 텍스트', example: '제품 사용후기를 동영상으로 제작' })
    missionText: string;

    @ApiProperty({ description: '상품 상세', example: '제품의 상세 설명' })
    productDetail: string;

    @ApiProperty({ description: '리워드 - 크레딧', example: '1000' })
    rewardCredit: string;

    @ApiProperty({ description: '리워드 - 추가 리워드', example: '추가 보너스 지급' })
    rewardAdditional: string;

    @ApiProperty({ description: '유의 사항', example: '주의사항 내용' })
    notes: string;

    @ApiProperty({ description: '예약 정보 - 위치)', example: 'Seoul'})
    location: string;

    @ApiProperty({ description: '예약 시간', example: '2025-03-05' })
    reserveTime: string;

    @ApiProperty({ description: '크리에이터 방문 시간', example: '2025-03-06' })
    visitTime: string;
}
