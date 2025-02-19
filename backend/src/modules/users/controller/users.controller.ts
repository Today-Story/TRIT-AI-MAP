import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dto/user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({ summary: '크리에이터 전체 조회' })
    @ApiResponse({
        status: 200,
        description: '전체 크리에이터 목록을 반환합니다.',
        type: [UserDto],
    })
    @Get('/creators')
    async getAllCreators(): Promise<UserDto[]> {
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
        type: UserDto,
    })
    @Get('/creators/:id')
    async getCreatorContents(@Param('id') id: number): Promise<UserDto | null> {
        return this.userService.findCreatorByIdWithContents(id);
    }
}
