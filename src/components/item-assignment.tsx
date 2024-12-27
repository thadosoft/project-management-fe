import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {DndContext, DragEndEvent, useDraggable, useDroppable} from "@dnd-kit/core";
import {Assignment} from "@/models/Assignment.ts";
import {User} from "@/models/User.ts";

type AssignmentProps = {
  assignment: Assignment,
  user: User,
  isLast?: boolean,
  isOver?: boolean,
  setNodeRef?: (element: (HTMLElement | null)) => void
}

export function ItemAssignment(
    {
      assignment,
      user,
      isLast,
      isOver,
      setNodeRef
    }: AssignmentProps
) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform
  } = useDraggable({
    id: assignment.id,
    data: assignment
  });

  // const {
  //   isOver,
  //   setNodeRef: setDroppableNodeRef,
  // } = useDroppable({
  //   id: assignment.assignmentOrder
  // });

  const style = {
    backgroundColor: isOver ? '#9ca3af' : undefined,
    transition: 'all 0.3s ease'
  };

  const dragStyle = transform ?
      {
        transform: `translate(${transform.x}px, ${transform.y}px)`
      } :
      undefined;

  return (
      <div>
        <div
            className="h-[2px] my-1"
            ref={setNodeRef}
            style={style}
        />
        <div
            ref={setDraggableNodeRef}
            {...listeners}
            {...attributes}
            className="flex flex-col p-2 pb-2 bg-zinc-700 rounded-sm hover:bg-opacity-70 cursor-pointer"
            style={dragStyle}
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
              <p>{assignment.status} {assignment.assignmentOrder}</p>
            </div>
            <Avatar className="h-5 w-5">
              <AvatarImage src="https://github.com/shadcn.png" alt={user.name}/>
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {
            isLast && (
                <div
                    className="h-[2px] my-1"
                    ref={setNodeRef}
                    style={style}
                />
            )
        }
      </div>

  )
}
