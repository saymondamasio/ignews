import { query } from "faunadb"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from "../../../services/fauna"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params:{
          scope: 'read:user'
        }
      }
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile }){
      const { email } = user

      try {
        // FQL
        //Cria um novo usuário com email
        await fauna.query(
          //se o usuário não existe, cria um novo usuário, senão retorna o usuário
          query.If(
            // não existe o usuário com o email
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(email!)
                )
              )
            ),
            // cria um usuario
            query.Create(query.Collection('users'), { data: { email } }),
            // retorna o usuário
            query.Get(
              query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(email!)
                )
            )
          )
        )
        
        return true
      } catch (error) {
        console.log('Error in FaunaDB: ' + error); 

        return false
      }
      
    }
  }
})
