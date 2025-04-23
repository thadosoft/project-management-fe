import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Project} from "@/models/Project.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {BsThreeDots} from "react-icons/bs";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Trash2} from "lucide-react";
import {useState} from "react";
import {deleteProject} from "@/services/projectService.ts";

interface ItemProjectProps {
  project: Project,
  removeProject: (projectId: string) => void
}

export function ItemProject({
                              project,
                              removeProject
                            }: ItemProjectProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDeleteProject = async () => {
    await deleteProject(project.id);
    removeProject(project.id);

    setIsDeleteDialogOpen(false)
  }

  return (
      <div className="h-[23vh] rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500 flex flex-col p-4">
        <div className="gap-2 w-full pb-2 flex justify-between">
          <p className="truncate text-2xl sm:text-xl md:text-2xl">
            <b>{project.name}</b>
          </p>

          <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover:bg-zinc-500">
                <BsThreeDots/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
              >
                <Trash2 className="mr-2"/>
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full pb-2">
          <p className="truncate text-muted-foreground text-sm sm:text-xs md:text-sm">
            {project.description}
          </p>
        </div>

        <div className="flex flex-row mt-auto mr-auto items-center">
          <Avatar className="h-9 w-9 sm:h-8 sm:w-8 md:h-9 md:w-9">
            <AvatarImage src="/avatars/shadcn.jpg" alt={project.user.name}/>
            <AvatarFallback>PM</AvatarFallback>
          </Avatar>
          <div className="flex items-center pl-2 w-[10vw]">
          <span className="font-semibold text-sm sm:text-xs md:text-sm">
            {project.user.name}
          </span>
          </div>
        </div>

        <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogContent
              onClick={(e) => e.stopPropagation()}
              className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Confirm delete</DialogTitle>
              <DialogDescription>
                Make sure you want to delete and{" "}
                <span className="text-red-500 font-bold">NOT UNDO</span>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-around">
              <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-400">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
