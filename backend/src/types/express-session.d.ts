import 'express-session';
import {UserRole} from "../modules/users/enums/users-role.enum";

declare module 'express-session' {
    interface SessionData {
        userId: number;
        userRole: UserRole;
    }
}
