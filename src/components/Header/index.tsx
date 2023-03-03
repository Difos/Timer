import { HeaderContainer } from './styles'
import { Timer, Scroll } from 'phosphor-react'

import logoIgnite from '../../assets/ignite-logo.svg'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoIgnite} alt="Dois triangulos sobrepostos"></img>
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/History" title="Historico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
