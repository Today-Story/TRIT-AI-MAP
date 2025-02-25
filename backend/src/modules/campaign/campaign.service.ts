import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Campaign} from "./entities/campaign.entity";
import {Repository} from "typeorm";
import {CreateCampaignDto} from "./dto/request/campaign.dto";

@Injectable()
export class CampaignService {
    constructor(
        @InjectRepository(Campaign)
        private readonly campaignRepository: Repository<Campaign>,
    ) {}

    async createCampaign(dto: CreateCampaignDto): Promise<Campaign> {

        const snsArray = dto.sns.split(',').map(status => status.trim()).filter(status => status !== '');

        const campaign = this.campaignRepository.create({
            ...dto,
            sns: snsArray,
        });
        return this.campaignRepository.save(campaign);
    }

    async getCampaignById(id: number): Promise<Campaign> {
        return this.campaignRepository.findOne({where: { id }});
    }

    async getAllCampaigns(): Promise<Campaign[]> {
        return this.campaignRepository.find();
    }
}
