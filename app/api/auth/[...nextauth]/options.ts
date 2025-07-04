import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { comparePasswords } from "@/utils/compare";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";
import { getAccountByUseId } from "@/utils/getAccount";
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers:[
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                try {
                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                    });
                    if(!user){
                        throw new Error("No user found")
                    }
                    if(!user.password){
                        throw new Error("No password found")
                    }
                    const isPasswordCorrect = await comparePasswords(
                        credentials.password,
                        user.password
                    );
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password")
                    }else{
                        return user;
                    }
                } catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ], 
    pages:{
        signIn:"/auth/login",
        error:"/auth/error",
        signOut:"/auth/login",
    },
    session:{
        strategy:"jwt"
    },
    events:{
        linkAccount: async ({ user, account, profile }) => {
            await db.user.update({
                where: { id: user.id },
                data:{
                    emailVerified:new Date(),
                }
            })
        }

    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async signIn({ user, account, profile }) {
            if(account?.provider!=="credentials") return true;

            const existingUser = await db.user.findUnique({
                where: { id:user?.id }
            });
            if(!existingUser?.emailVerified) return false;
            
            //2FA check
            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if(!twoFactorConfirmation){
                    return false;
                }

                //Delete two factor confirmation for nect sign in.
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }
            
            return true;
        },
        async jwt({ token, user,trigger, session }) {
            if(trigger === "update"){
                return { ...token, ...session.user };
            }
            if(user){
                const existingAccount = await getAccountByUseId(user.id);
                token._id = user.id?.toString()
                token.role = user.role
                token.isTwoFactorEnabled = user.isTwoFactorEnabled;
                token.name = user.name;
                token.isOauth = !!existingAccount;
                // !! means convert from truthy/falsy to boolean
            }
            return token
        },
        async session({ session,token }) {
            if(token.sub && session.user){
                session.user._id = token._id
                session.user.role = token.role;
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
                session.user.name = token.name;
                session.user.isOauth = token.isOauth;
            }
            return session
        }
    }
}