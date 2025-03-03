import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Project} from "@/models/Project.ts";

interface ItemProjectProps {
  project: Project;
}

export function ItemProject({
                              project
                            }: ItemProjectProps) {
  return (
      <div className="h-[23vh] rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500 flex flex-col p-4">
        <div className="gap-2 w-full pb-2">
          <p className="truncate text-2xl sm:text-xl md:text-2xl"><b>{project.name}</b></p>
        </div>
        <div className="w-full pb-2">
          <p className="truncate text-muted-foreground text-sm sm:text-xs md:text-sm">{project.description}</p>
        </div>
        <div className="flex flex-row mt-auto mr-auto items-center">
          <Avatar className="h-9 w-9 sm:h-8 sm:w-8 md:h-9 md:w-9">
            <AvatarImage src="/avatars/shadcn.jpg" alt={project.user.name}/>
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
          <div className="flex items-center pl-2 w-[10vw]">
            <span className="font-semibold text-sm sm:text-xs md:text-sm">{project.user.name}</span>
          </div>
        </div>
      </div>
  )
}
