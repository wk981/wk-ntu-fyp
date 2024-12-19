import { useAuth } from '@/features/auth/hook/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'

export const Profile = () => {
  const { user } = useAuth()
  const avatarImage = user?.pic || 'https://github.com/shadcn.png'

  return (
    <Link to={'profile'} className="h-12 w-12 cursor-pointer">
      <Avatar>
        <AvatarImage src={avatarImage} className="rounded-full object-cover" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Link>
  )
}
