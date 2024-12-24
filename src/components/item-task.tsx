import {ItemAssignment} from "@/components/item-assignment.tsx";
import {Assignment, Task, User} from "@/types.tsx";
import {useDroppable} from "@dnd-kit/core";

type TaskProps = {
  task: Task;
  assignments: Assignment[];
  user: User;
}

export function ItemTask({
                           task,
                           assignments,
                           user
                         }: TaskProps) {

  const {setNodeRef} = useDroppable({
    id: task.id
  })

  return (
      <div ref={setNodeRef} className="min-w-[300px]">
        <div className="flex flex-col rounded-xl p-4 bg-muted/50">
          <div className="gap-2 pb-2 hover:bg-sidebar-accent">
            <p>{task.title}</p>
          </div>
          {
            assignments.map((assignment: Assignment) => {
              return <ItemAssignment key={assignment.id} assignment={assignment} user={user}/>
            })
          }
        </div>
      </div>
  )
}
