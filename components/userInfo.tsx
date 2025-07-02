import { useSession } from "next-auth/react";

interface UserInfoProps {
    user?: User;
    label?: string;
}