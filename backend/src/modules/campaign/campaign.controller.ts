import {Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CampaignService} from "./campaign.service";
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Campaign} from "./entities/campaign.entity";
import {CreateCampaignDto} from "./dto/request/campaign.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {S3Service} from "../../common/s3/s3.service";

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService,
                private readonly s3Service: S3Service
    ) {}

    @Post()
    @ApiConsumes('multipart/form-data')

    @ApiOperation({ summary: '캠페인 등록', description: '업체가 새로운 캠페인을 등록합니다.' })
    @ApiResponse({ status: 201, description: '캠페인 등록 성공', type: Campaign })
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string', example: '신제품 런칭 캠페인'},
                brandName: {type: 'string', example: 'ABC Company'},
                // 파일 업로드 필드: type "string"과 format "binary"를 지정합니다.
                image: {type: 'string', format: 'binary'},
                applicationStart: {type: 'string', format: 'date', example: '2025-03-01'},
                applicationEnd: {type: 'string', format: 'date', example: '2025-03-10'},
                selectionStart: {type: 'string', format: 'date', example: '2025-03-11'},
                selectionEnd: {type: 'string', format: 'date', example: '2025-03-15'},
                announcement: {type: 'string', format: 'date', example: '2025-03-16'},
                resultAnnouncement: {type: 'string', format: 'date', example: '2025-03-20'},
                people: {type: 'number', example: 50},
                videoMin: {type: 'number', example: 30},
                videoMax: {type: 'number', example: 120},
                sns: {
                    type: 'array',
                    items: {type: 'string'},
                    example: ['youtube', 'instagram']
                },
                missionText: {type: 'string', example: '제품 사용후기를 동영상으로 제작'},
                productDetail: {type: 'string', example: '제품의 상세 설명'},
                rewardCredit: {type: 'string', example: '1000'},
                rewardAdditional: {type: 'string', example: '추가 보너스 지급'},
                notes: {type: 'string', example: '주의사항 내용'},
                location: {type: 'string', example: 'Seoul'},
                reserveTime: {type: 'string', example: '2025-03-05'},
                visitTime: {type: 'string', example: '2025-03-06'},
            },
        },
    })
    async createCampaign(
        @UploadedFile() file: Express.Multer.File,
        @Body() createCampaignDto: CreateCampaignDto,
    ): Promise<Campaign> {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'campaign');
            createCampaignDto.image = imageUrl;
        }
        return this.campaignService.createCampaign(createCampaignDto);
    }


    @Get(':id')
    @ApiOperation({ summary: '캠페인 조회', description: '캠페인 ID로 캠페인 정보를 조회합니다.' })
    @ApiResponse({ status: 200, description: '캠페인 정보 반환', type: Campaign })
    async getCampaign(@Param('id') id: number): Promise<Campaign> {
        return this.campaignService.getCampaignById(id);
    }

    @Get()
    @ApiOperation({ summary: '전체 캠페인 조회', description: '모든 캠페인 정보를 조회합니다.' })
    @ApiResponse({ status: 200, description: '캠페인 목록 반환', type: [Campaign] })
    async getAllCampaigns(): Promise<Campaign[]> {
        return this.campaignService.getAllCampaigns();
    }

}
