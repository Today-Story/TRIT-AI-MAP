import { Expose } from 'class-transformer';

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    nickname: string;

    @Expose()
    gender: string;

    @Expose()
    phoneNumber: string;

    @Expose()
    address: string;

    @Expose()
    birthday: Date;

    @Expose()
    nationality: string;
}
