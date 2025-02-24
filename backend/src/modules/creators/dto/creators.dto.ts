// src/creators/creator.dto.ts
import { Expose, Type } from 'class-transformer';
import { ContentDto } from '../../contents/contents.dto';
import {UserDto} from "../../users/user.dto";

export class CreatorsDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => UserDto)
    user: UserDto;

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

    @Expose()
    @Type(() => ContentDto)
    contents: ContentDto[];
}
