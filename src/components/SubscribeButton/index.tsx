import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeClient } from '../../services/stripe-client';
import styles from './styles.module.scss';

interface Props {
  priceId: string
}

export function SubscribeButton({ priceId }: Props) {
  const { data:session } = useSession()
  
  async function handleSubscribe(){
    if(!session){
      signIn('github')

      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeClient()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      alert((error as Error).message)
    }
  }

  return (
    <button className={styles.subscribeButton} type='button' onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}
