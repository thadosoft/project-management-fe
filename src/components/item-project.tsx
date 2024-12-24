import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export function ItemProject({
                              user,
                            }: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
      <div className="flex flex-col p-4 h-auto min-h-full">
        <div className="gap-2">
          <p className="text-2xl"><b>Solution Bank</b></p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Team-managed software</p>
        </div>
        <div className="flex flex-row mt-auto ml-auto items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name}/>
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
          <div className="flex items-center pl-2">
            <span className="truncate font-semibold">{user.name}</span>
          </div>
        </div>
      </div>
  )
}
