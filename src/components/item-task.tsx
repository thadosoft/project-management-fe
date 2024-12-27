import {ItemAssignment} from "@/components/item-assignment.tsx";
import {useDroppable} from "@dnd-kit/core";
import {Task} from "@/models/Task.ts";
import {Assignment} from "@/models/Assignment.ts";
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type TaskProps = {
  task: Task,
  assignments: Assignment[],
  isLast?: boolean
}

export function ItemTask({
                           task,
                           assignments,
                           isLast
                         }: TaskProps) {

  useEffect(() => {
    assignments.sort((a, b) =>
        a.assignmentOrder - b.assignmentOrder);
  }, [assignments]);

  const {isOver, setNodeRef} = useDroppable({
    id: task.status
  });

  const style = {
    backgroundColor: isOver ? '#334155' : undefined,
    transition: 'all 0.3s ease'
  };

  return (
      <div className="flex">
        <div className="w-[2px] bg-zinc-400 mx-1"/>
        <div className="rounded-xl min-w-[300px]">
          <div ref={setNodeRef} style={style} className="flex flex-col rounded-xl p-4 bg-zinc-900">
            <div className="gap-2 pb-2 hover:bg-sidebar-accent">
              <p>{task.status}</p>
            </div>
            {
              assignments.map((assignment: Assignment, index: number) => (
                  <div key={assignment.id}>
                    <ItemAssignment
                        isOver={isOver}
                        setNodeRef={setNodeRef}
                        isLast={index === assignments.length - 1}
                        user={assignment.receiver}
                        assignment={assignment}/>
                  </div>
              ))
            }
            <div className="flex items-center p-1 pl-2 hover:bg-sidebar-accent cursor-pointer">
              <FontAwesomeIcon icon={faPlus} />
              <p className="pl-4">Create</p>
            </div>
          </div>

        </div>
        {
            isLast && (<div className="w-[2px] bg-zinc-400 mx-1"/>)
        }
      </div>
  )
}
