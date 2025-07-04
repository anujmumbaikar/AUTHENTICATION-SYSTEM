import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User{
        _id?: string;
        role?: string;
        isTwoFactorEnabled?: boolean;
        isOauth?: boolean;
    }
    interface Session{
        user:{
            _id?: string;
            role?: string;
            isTwoFactorEnabled?: boolean;
            isOauth?: boolean;
        } & DefaultSession["user"]
        // Defaultsession includes name, email, image
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        role?: string;
        isTwoFactorEnabled?: boolean;
        isOauth?: boolean;
    }
}