import { NextApiRequest, NextApiResponse } from "next";

import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable){
    const chunks = []

    for await (const chunk of readable){
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(chunks)
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set(['checkout.session.completed'])

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
    if(request.method === 'POST'){
        //recebe os dados da requisição
        const buf = await buffer(request)

        const secret = request.headers['stripe-signature']

        let event: Stripe.Event

        try{
            //pega o evento do webhook
            event = stripe.webhooks.constructEvent(buf, secret!, process.env.STRIPE_WEBHOOK_SECRET!)
        } catch(err) {
            return response.status(400).send(`Webhook Error: ${(err as Error).message}`)
        }

        const { type } = event

        if(relevantEvents.has(type)){
            try {
                switch (type) {
                    case 'checkout.session.completed':

                        //tipa para o evento especifico de checkout completo
                        const checkoutSession = event.data.object as Stripe.Checkout.Session

                        //salva a subscription no banco
                        await saveSubscription(checkoutSession.subscription?.toString()!, checkoutSession.customer?.toString()!)

                        break
                    default:
                        throw new Error(`Unexpected event type: ${type}`)
                }
            } catch (error) {
                return response.json({ error: (error as Error).message })
            }
        }

        response.status(200).end();
    } else {
        response.setHeader('Allow', 'POST')
        response.status(405).end(`Method ${request.method} Not Allowed`)
    }
}