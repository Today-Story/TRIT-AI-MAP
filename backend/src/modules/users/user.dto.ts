// users/user.dto.ts
import { Expose, Type } from 'class-transformer';
import {ContentDto} from "../contents/contents.dto";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    userId: string;

    @Expose()
    nickname: string;

    @Expose()
    category: string;

    @Expose()
    youtube: string;

    @Expose()
    instagram: string;

    @Expose()
    tiktok: string;

    @Expose()
    profilePicture: string;

    // 관계된 콘텐츠들을 ContentDto로 매핑
    @Expose()
    @Type(() => ContentDto)
    contents: ContentDto[];
}
