import { ApiProperty } from '@nestjs/swagger';

export class CreateApplynDto {
    @ApiProperty({ description: '캠페인 ID', example: 1 })
    campaignId: number;

    @ApiProperty({ description: '이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '이메일', example: 'hong@example.com' })
    email: string;

    @ApiProperty({ description: '핸드폰번호', example: '010-1234-5678' })
    phoneNumber: string;

    @ApiProperty({ description: '생년월일', example: '1990-01-01' })
    birthday: string;

    @ApiProperty({ description: '성별', example: 'MAN' })
    gender: string;

    @ApiProperty({ description: 'SNS 주소', example: 'https://www.instagram.com/creator' })
    snsAddress: string;

    @ApiProperty({ description: '자기소개', example: '안녕하세요, 크리에이터 홍길동입니다.' })
    introduction: string;

    @ApiProperty({ description: '예약 상품 옵션', example: '옵션1: A, 옵션2: B' })
    reservationOption: string;
}
