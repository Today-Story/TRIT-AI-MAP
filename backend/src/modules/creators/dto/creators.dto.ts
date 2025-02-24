import { ApiProperty } from '@nestjs/swagger';
import { Creator } from '../entities/creators.entity';
import { Content } from '../../contents/content.entity';

export class CreatorsDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'creator@example.com' })
    email: string;

    @ApiProperty({ example: '크리에이터닉네임' })
    nickname: string;

    @ApiProperty({ example: 'MAN' })
    gender: string;

    @ApiProperty({ example: '010-1234-5678' })
    phoneNumber: string;

    @ApiProperty({ example: 'Seoul, Korea' })
    address: string;

    @ApiProperty({ example: '1990-01-01' })
    birthday: string | null;

    @ApiProperty({ example: 'Korea' })
    nationality: string;

    @ApiProperty({ example: 'TRAVEL' })
    category: string;

    @ApiProperty({ example: 'https://www.youtube.com/@channel' })
    youtube: string;

    @ApiProperty({ example: 'https://www.instagram.com/username' })
    instagram: string;

    @ApiProperty({ example: 'https://www.tiktok.com/@username' })
    tiktok: string;

    @ApiProperty({ example: [], description: '크리에이터가 작성한 콘텐츠 목록' })
    contents: {
        id: number;
        title: string;
        url: string;
        createdAt: Date;
    }[];

    constructor(creator: Creator) {
        this.id = creator.id;
        this.email = creator.user?.email || "N/A"; // user가 없으면 기본값
        this.nickname = creator.user?.nickname || "N/A";
        this.gender = creator.user?.gender || "N/A";
        this.phoneNumber = creator.user?.phoneNumber || "N/A";
        this.address = creator.user?.address || "N/A";

        if (creator.user?.birthday instanceof Date) {
            this.birthday = creator.user.birthday.toISOString().split('T')[0];
        } else if (typeof creator.user?.birthday === 'string') {
            this.birthday = creator.user.birthday; // 이미 문자열이면 그대로 사용
        } else {
            this.birthday = null; // 기본값 설정
        }

        this.nationality = creator.user?.nationality || "N/A";
        this.category = creator.category || "N/A";
        this.youtube = creator.youtube || "N/A";
        this.instagram = creator.instagram || "N/A";
        this.tiktok = creator.tiktok || "N/A";

        this.contents = creator.contents?.map((content: Content) => ({
            id: content.id,
            title: content.title,
            url: content.url,
            createdAt: content.createdAt,
        })) || [];
    }
}
