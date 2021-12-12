import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(subscriptionId: string, customerId: string){
  //retorna o referencia do usuario pelo customer id do stripe
  const userRef = await fauna.query(
    query.Select(
      "ref",
      query.Get(
        query.Match(
          query.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  //retorna os dados da subscription do stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  //salva a subscription no faunadb
  await fauna.query(
    query.Create(
      query.Collection("subscriptions"),
      {
        data: subscriptionData
      }
    )
  )
}