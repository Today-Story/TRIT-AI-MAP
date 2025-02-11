import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';

@Injectable()
export class ContentsService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) {
    }

    async saveContents(contents: any[]): Promise<void> {
        if (!contents.length) {
            console.log('No data to insert');
            return;
        }
        try {
            const contentEntities = contents.map((data) =>
                this.contentRepository.create({
                    id: data.id,
                    postNumber: data.postNumber,
                    title: data.title,
                    url: data.url,
                    author: data.author,
                    authorId: data.authorId,
                    createdAt: data.createdAt,
                    views: data.views,
                    likes: data.likes,
                    category: data.category,
                    location: data.location,
                }),
            );


            await this.contentRepository.save(contentEntities);
        } catch (error) {
            console.log('Error inserting data:', error);
        }
    }

}