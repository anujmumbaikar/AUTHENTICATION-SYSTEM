import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { comparePasswords } from "@/utils/compare";
export const authOptions: NextAuthOptions = {
    providers:[
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
        signIn:"/sign-in",
        
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session,token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    }
}