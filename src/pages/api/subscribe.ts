import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string
  },
  data: {
    stripe_customer_id: string
  }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if(request.method === 'POST'){

    //pegando as informações do usuario logado
    const session = await getSession({ req:request })

    if(!session?.user?.email){
      return response.status(401).json({
        message: 'You not authorized'
      })
    }

    //pega o usuario salvo no banco
    const user = await fauna.query<User>(
      query.Get(
        query.Match(
          query.Index('user_by_email'),
          query.Casefold(session.user.email)
        )
      )
    )

    
    //verifica se o usuario ja se cadastrou no stripe
    let customerId = user.data.stripe_customer_id
    
    if(!customerId) {
      //criando o cliente no stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      //atualiza o usuario no banco com o id do cliente stripe
      await fauna.query(
        query.Update(
          query.Ref(query.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }
    

    
    // criando o checkout no stripe
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{
        price: 'price_1K5GHQBWgX1VGRQu0xyQHe1c',
        quantity: 1,
      }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL || '',
      cancel_url: process.env.STRIPE_CANCEL_URL || '',
    })

    return response.status(200).json({
      sessionId: stripeCheckoutSession.id
    })
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end(`Method ${request.method} Not Allowed`)
  }
}