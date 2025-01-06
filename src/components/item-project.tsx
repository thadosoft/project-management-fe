import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Project} from "@/models/types.ts";

interface ItemProjectProps {
  project: Project;
}

export function ItemProject({
                              project
                            }: ItemProjectProps) {
  return (
      <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500">
        <div className="flex flex-col p-4 h-auto min-h-full">
          <div className="gap-2">
            <p className="text-2xl"><b>{project.name}</b></p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{project.description}</p>
          </div>
          <div className="flex flex-row mt-auto ml-auto items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/shadcn.jpg" alt={project.user.name}/>
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
            <div className="flex items-center pl-2">
              <span className="truncate font-semibold">{project.user.name}</span>
            </div>
          </div>
        </div>
      </div>
  )
}
