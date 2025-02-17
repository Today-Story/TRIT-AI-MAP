import {Controller, Get, Param} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // 전체 사용자 조회
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    // 특정 사용자 조회 (userId 기준)
    @Get('/userId/:userId')
    async getUserByUserId(@Param('userId') userId: string): Promise<User> {
        return this.userService.findByUserId(userId);
    }

    // 특정 사용자 조회 (id 기준)
    @Get('/:id')
    async getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.findById(id);
    }
}
