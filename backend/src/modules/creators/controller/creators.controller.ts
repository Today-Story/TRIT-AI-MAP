import { Controller, Get, Param } from '@nestjs/common';
import { CreatorsService } from '../services/creators.service';
import { CreatorsDto } from '../dto/creators.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('creators')
@Controller('creators')
export class CreatorsController {
    constructor(private readonly userService: CreatorsService) {}

    @ApiOperation({ summary: '크리에이터 전체 조회' })
    @ApiResponse({
        status: 200,
        description: '전체 크리에이터 목록을 반환합니다.',
        type: [CreatorsDto],
    })
    @Get('')
    async getAllCreators(): Promise<CreatorsDto[]> {
        return this.userService.findAllCreators();
    }

    @ApiOperation({ summary: '크리에이터가 작성한 콘텐츠 조회' })
    @ApiParam({
        name: 'id',
        type: Number,
        description: '크리에이터 ID',
    })
    @ApiResponse({
        status: 200,
        description: '특정 크리에이터가 작성한 콘텐츠를 반환합니다.',
        type: CreatorsDto,
    })
    @Get('/:id')
    async getCreatorContents(@Param('id') id: number): Promise<CreatorsDto | null> {
        return this.userService.findCreatorByIdWithContents(id);
    }
}
