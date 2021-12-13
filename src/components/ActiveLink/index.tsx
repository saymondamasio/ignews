import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface Props extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({ children, activeClassName, ...rest } : Props){
  const { asPath } = useRouter()

  const className = asPath === rest.href ? activeClassName : ''

  return (
    <Link {...rest}>
      {/* Clonando o elemento e adicionando um atributo a ele */}
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}