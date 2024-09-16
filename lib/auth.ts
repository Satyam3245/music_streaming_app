import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";

const option = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params: any) {
      if (!params.user.email) {
        return false;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: params.user.email },
        });
        if(existingUser){
          return true;
        }
        const newUser = await prisma.user.create({
            data: {
              email: params.user.email,
              provider: "Google", 
            },
        });
        console.log(newUser.id);    
        return true;
      
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; 
      }
    },
    async session({session,user}:any){
      const userData = await prisma.user.findUnique({
        where:{
          email:session.user.email as string
        } 
      });
      if(userData){
        session.user.id = userData.id;
      }
      return session;
    }
  },
};

export default option;
