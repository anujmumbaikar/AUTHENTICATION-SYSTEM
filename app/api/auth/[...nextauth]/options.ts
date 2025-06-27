import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { comparePasswords } from "@/utils/compare";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
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
        async jwt({ token, user}) {
            if(user){
                token._id = user.id?.toString()
                token.role = user.role
            }
            return token
        },
        async session({ session,token }) {
            if(token.sub && session.user){
                session.user._id = token._id
                session.user.role = token.role;
            }
            return session
        }
    }
}