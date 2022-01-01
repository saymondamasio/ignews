import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeClient } from '../../services/stripe-client'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')

      return
    }

    if (session.activeSubscription) {
      router.push('/posts')

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
    <button
      className={styles.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
