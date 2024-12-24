import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Assignment, User} from "@/types.tsx";
import {useDraggable} from "@dnd-kit/core";

type AssignmentProps = {
  assignment: Assignment;
  user: User;
}

export function ItemAssignment({assignment, user}: AssignmentProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: assignment.id,
  })

  const style = transform ?
      {
        transform: `translate(${transform.x}px, ${transform.y}px)`
      } :
      undefined;

  return (
      <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="flex flex-col p-2 pb-2 mb-2 bg-blue-300 bg-opacity-40 rounded-sm hover:bg-opacity-60 cursor-pointer"
          style={style}
      >
        <div className="flex justify-between items-center">
          <div>
            <p>{assignment.title}</p>
          </div>
          <div>
            <p>•••</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p>{assignment.status}</p>
          </div>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatar} alt={user.name}/>
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
        </div>
      </div>

  )
}
