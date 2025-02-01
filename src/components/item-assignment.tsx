import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cva} from "class-variance-authority";
import {GripVertical} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Assignment} from "@/models/Assignment.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface Props {
  assignment: Assignment;
  isOverlay?: boolean;
}

export type AssignmentType = "Assignment";

export interface AssignmentDragData {
  type: AssignmentType;
  assignment: Assignment;
}

export function ItemAssignment({assignment, isOverlay}: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: assignment.id,
    data: {
      type: "Assignment",
      assignment,
    } satisfies AssignmentDragData,
    attributes: {
      roleDescription: "Assignment",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
      <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
      >
        <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
          <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move assignment</span>
            <GripVertical/>
          </Button>
          <Badge variant={"outline"} className="ml-auto font-semibold">
            Assignment
          </Badge>
        </CardHeader>

        <Dialog>
          <DialogTrigger asChild>
            <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap cursor-pointer">
              {assignment.title}
            </CardContent>
          </DialogTrigger>
          <DialogContent
              onInteractOutside={(event) => event.preventDefault()}
              className="sm:max-w-max"
          >
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-md rounded-lg md:min-w-[80vw]"
            >
              <ResizablePanel defaultSize={75} className="h-[80vh] md:min-w-[25vw]">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={10} className="md:min-h-[8vh] md:max-h-[8vh]">
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">
                        <span className="font-semibold">{assignment.title}</span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle/>
                  <ResizablePanel defaultSize={90}>
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">
                        <span className="font-bold">Description</span>
                      </div>
                      <div className="flex h-full items-center">
                        <span>{assignment.description}</span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle/>
              <ResizablePanel defaultSize={25} className="h-[80vh] md:min-w-[15vw]">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={10} className="md:min-h-[8vh] md:max-h-[8vh]">
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">
                        <span className="font-semibold">Two</span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle/>
                  <ResizablePanel defaultSize={90}>
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">
                        <span className="font-semibold">Four</span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </DialogContent>
        </Dialog>
      </Card>
  );
}
