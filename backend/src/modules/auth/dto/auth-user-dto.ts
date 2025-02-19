import { Expose } from 'class-transformer';

export class AuthUserDto {
    @Expose()
    id: number;

    @Expose({ name: 'userId' })
    email: string;

    @Expose()
    nickname: string;

    @Expose()
    profilePicture: string;

    @Expose()
    nationality: string;

    @Expose()
    role: string;
}
