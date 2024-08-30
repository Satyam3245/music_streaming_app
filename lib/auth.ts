import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
interface Params{
  email : string;

}
const option = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
          })
      ],
      secret : process.env.NEXTAUTH_URL,
      callbacks: {
        async signIn(params:any) {
          if(!params.user.email){
            return false
          }
          try {
            await prisma.user.create({
              data:{
                email:params.user.email ?? "",
                provider:"Google"
              }
            })
          } catch (error) {
          
          }
          return true
        }
        
      }  
      
}
export default option;