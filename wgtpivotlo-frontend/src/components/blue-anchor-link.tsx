import { capitalizeFirstChar } from '@/utils'
import { Link, To } from 'react-router-dom'

interface NavbarItemType {
  name: string
  toPath: To
}

export const BlueAnchorLink = ({ name, toPath }: NavbarItemType) => {
  return (
    <Link to={toPath}>
      <p className="text-navbar">{capitalizeFirstChar(name)}</p>
    </Link>
  )
}
