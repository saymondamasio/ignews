import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/'
  })
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null
  })
}))

describe('Header component', () => {
  it('renders correctly', () => {
    render(
      <Header />
    )
  
    expect(screen.getByText('Home'))
    expect(screen.getByText('Posts'))
  })
})
