// content.dto.ts
import { Expose } from 'class-transformer';
import { ContentCategory } from './content.entity';

export class ContentDto {
    // DB의 id 필드를 contentId로 노출합니다.
    @Expose({ name: 'id' })
    contentId: number;

    @Expose()
    postNumber: number;

    @Expose()
    title: string;

    @Expose()
    url: string;

    @Expose()
    createdAt: Date;

    @Expose()
    views: number;

    @Expose()
    likes: number;

    @Expose()
    category: ContentCategory;

    @Expose()
    location: string;

    @Expose()
    latitude: number;

    @Expose()
    longitude: number;
}
