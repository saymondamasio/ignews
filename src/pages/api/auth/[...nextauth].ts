import { query } from 'faunadb'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user?.email) {
        return session
      }

      try {
        //buscar se o usuario ja tem uma assinatura
        const userActiveSubscription = await fauna.query(
          //retorna a subscription pela ref do usuario
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                //retorna somente a ref
                query.Select(
                  'ref',
                  //retorna o usuario pelo email
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user.email)
                    )
                  )
                )
              ),
              query.Match(query.Index('subscription_by_status'), 'active'),
            ])
          )
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile }) {
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
              query.Match(query.Index('user_by_email'), query.Casefold(email!))
            )
          )
        )

        return true
      } catch (error) {
        console.log('Error in FaunaDB: ' + error)

        return false
      }
    },
  },
})
