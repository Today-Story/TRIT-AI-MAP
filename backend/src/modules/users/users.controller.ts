import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({ summary: '전체 사용자 조회' })
    @ApiResponse({
        status: 200,
        description: '전체 사용자 목록을 반환합니다.',
        type: [UserDto],
    })
    @Get()
    async getAllUsers(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: '사용자 별로 작성한 컨텐츠 조회' })
    @ApiParam({
        name: 'id',
        type: Number,
        description: '조회할 사용자의 DB 고유 id',
    })
    @ApiResponse({
        status: 200,
        description: '특정 사용자 데이터를 반환합니다.',
        type: UserDto,
    })
    @Get('/:id')
    async getUserById(@Param('id') id: number): Promise<UserDto> {
        return this.userService.findById(id);
    }
}
