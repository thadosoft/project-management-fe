import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cva} from "class-variance-authority";
import {GripVertical} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Assignment, AssignmentRequest} from "@/models/Assignment.ts";
import {Dialog, DialogContent, DialogDescription, DialogTrigger} from "@/components/ui/dialog.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Download, Trash2} from "lucide-react";
import {DialogTitle} from "@radix-ui/react-dialog";
import JoditEditor from "jodit-react";
import {updateAssignment} from "@/services/assignmentService.ts";
import {download, getAttachFileNames, getUploadedDate, upload} from "@/services/mediaService.ts";
import {BASE_API_URL} from "@/utils/api.ts";
import pdfImg from "@/assets/imgs/pdf.png";
import xlsxImg from "@/assets/imgs/xlsx.png";
import otherImg from "@/assets/imgs/other.png";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog.tsx";
import {deleteByFileName} from "@/services/mediaService.ts";
import {MediaRequest} from "@/models/Media.ts";

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachFiles, setAttachFiles] = useState<{ url: string; type: string; name: string; uploadedDate: Date }[]>([]);
  const didFetch = useRef(false);
  const [isOpen, setIsOpen] = useState(true);
  const [fileNames, setFileNames] = useState<{ name: string; blob: string }[]>([]);

  const handleAddButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      [...selectedFiles].map(async (file: File) => {
        await upload(file, assignment.id, assignment.task.project.name, false);

        const mediaRequest: MediaRequest = {
          projectName: assignment.task.project.name,
          fileName: `${assignment.id}_attach_${file.name}`,
        }

        download(mediaRequest)
        .then(async response => {
          const uploadedDate = await getUploadedDate(file.name);

          if (response && uploadedDate) {
            setAttachFiles((prev) => [
              ...prev,
              {
                url: URL.createObjectURL(response),
                type: file.type,
                name: file.name,
                uploadedDate: uploadedDate
              }
            ]);
          } else {
            console.error("No image data received");
          }
        })
        .catch(error => {
          console.error("Error download image:", error);
        });
      })
    }
  };

  const handleContentChange = () => {
    setIsEditing(false)

    const parser = new DOMParser();
    const changedContent = parser.parseFromString(content, "text/html");

    changedContent.querySelectorAll("img").forEach((img) => {
      const matchedFile = fileNames.find((file) => file.blob === img.src);
      if (matchedFile) {
        img.src = matchedFile.name;
      }
    });

    console.log(changedContent.body.innerHTML)

    const assignmentRequest: AssignmentRequest = {
      title: assignment.title,
      description: changedContent.body.innerHTML,
      assignmentOrder: assignment.assignmentOrder,
      taskId: assignment.task.id,
      assignerId: assignment.assigner.id,
      receiverId: assignment.receiver.id,
    };

    updateAssignment(assignment.id, assignmentRequest)
    .then(() => console.log("Assignment updated successfully"))
    .catch((error) => console.error("Error in update assignment:", error));
  }

  const editor = useRef(null);
  const [content, setContent] = useState<string>(assignment.description);
  const [isEditing, setIsEditing] = useState(false);
  const editorConfig = useMemo(() => ({
    readonly: false,
    height: 300,
    imageDefaultWidth: 200,
    toolbarSticky: true,
    toolbarAdaptive: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    theme: "dark",
    enableDragAndDropFileToEditor: true,
    uploader: {
      url: `${BASE_API_URL}medias`,

      prepareData: function (formData: FormData) {
        formData.append("assignmentId", assignment.id);
        formData.append("projectName", assignment.task.project.name);
        formData.append("isContent", "true");
        return formData;
      },

      filesVariableName: () => 'file',

      isSuccess: function (response: any) {
        return response && typeof response === 'object' && response.fileName;
      },

      getMessage: function (response: any) {
        return response.message || 'Upload error';
      },

      process: async function (response: any) {
        if (!response || !response.fileName) {
          console.error("Invalid response:", response);
          return {files: []};
        }

        const mediaRequest: MediaRequest = {
          projectName: assignment.task.project.name,
          fileName: response.fileName,
        }

        const blob = await download(mediaRequest);
        const url = URL.createObjectURL(blob!)

        setFileNames(prev => [...prev, {name: mediaRequest.fileName!, blob: url}]);

        setContent(prev => prev + `<img src=${url} alt=${response.fileName.split("_").slice(1).join()} >`);

        return {
          files: [],
          baseurl: '',
          isImages: [true]
        };
      }
    },
  }), []);

  useEffect(() => {
    const parser = new DOMParser();
    const initContent = parser.parseFromString(content, "text/html");

    initContent.querySelectorAll("img").forEach((img) => {
      const mediaRequest: MediaRequest = {
        projectName: assignment.task.project.name,
        fileName: decodeURIComponent(img.src.split("/").slice(5).join("/")),
      }

      download(mediaRequest)
      .then(response => {
        const blobUrl = URL.createObjectURL(response!);
        img.src = blobUrl;
        setFileNames(prev => [...prev, {name: mediaRequest.fileName!, blob: blobUrl}]);

        if (initContent.body.innerHTML !== content) {
          setContent(initContent.body.innerHTML);
        }
      })
      .catch(error => {
        console.error("Error download image:", error);
      });
    });
  }, [])

  useEffect(() => {
    setContent(content);
  }, [content]);

  const handleDeleteAttachFile = async (fileName: string) => {
    setAttachFiles(prev => prev.filter(file => file.name !== fileName));

    const mediaRequest: MediaRequest = {
      projectName: assignment.task.project.name,
      assignmentId: assignment.id,
      fileName: fileName,
    }

    await deleteByFileName(mediaRequest);
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    setAttachFiles([]);

    const mediaRequest: MediaRequest = {
      projectName: assignment.task.project.name,
      assignmentId: assignment.id
    }

    getAttachFileNames(mediaRequest)
    .then(response => {
      response?.map((fileName) => {
        mediaRequest.fileName = fileName;

        download(mediaRequest)
        .then(async response => {
          const uploadedDate = await getUploadedDate(fileName.split("_").slice(2).join("_"))

          if (response && uploadedDate) {
            setAttachFiles((prev) => [
              ...prev,
              {
                url: URL.createObjectURL(response),
                type: response.type,
                name: fileName.split("_").slice(2).join("_"),
                uploadedDate: uploadedDate
              }
            ]);
          } else {
            console.error("No image data received");
          }
        })
        .catch(error => {
          console.error("Error fetching image:", error);
        });
      })
    })
    .catch(error => {
      console.error("Error fetching attach file name:", error);
    });
  }, [attachFiles])

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

        <Dialog modal={false}>
          <DialogTrigger asChild>
            <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap cursor-pointer">
              {assignment.title}
            </CardContent>
          </DialogTrigger>
          <DialogContent

              onInteractOutside={(event) => event.preventDefault()}
              className="sm:max-w-max"
          >
            <div className="hidden">
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-md rounded-lg md:min-w-[85vw]"
            >
              <ResizablePanel defaultSize={60} className="h-[85vh] md:min-w-[25vw]">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={10} className="md:min-h-[8vh] md:max-h-[8vh]">
                    <div className="h-full flex items-center pl-4">
                      <span className="font-semibold text-2xl">{assignment.title}</span>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle/>
                  <ResizablePanel defaultSize={90}>
                    <ScrollArea className="h-full w-full p-4">
                      <div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mb-4"
                            onClick={handleAddButton}
                        >
                          + Add
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileAttach}
                            className="hidden"
                            multiple
                        />
                      </div>
                      <div className="flex h-full items-center pb-2">
                        <span className="font-bold">Description</span>
                      </div>
                      <div className="flex h-full flex-wrap pb-2">
                        {
                          !isEditing ? (
                              <div
                                  className={`border p-2 cursor-pointer w-full rounded text-gray-400 hover:bg-sidebar-accent duration-200 ${
                                      content ? "" : "italic"
                                  }`}
                                  onClick={() => setIsEditing(true)}
                                  dangerouslySetInnerHTML={{
                                    __html: content || "<p>Click here to start writing...</p>",
                                  }}
                              />
                          ) : (
                              <div>
                                <JoditEditor
                                    config={editorConfig}
                                    ref={editor}
                                    value={content}
                                    onChange={newContent => setContent(newContent)}
                                />

                                <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleContentChange}
                                >
                                  Save
                                </button>
                              </div>
                          )
                        }
                      </div>
                      <div className="flex h-full items-center pb-1">
                        <span className="font-bold">Attachments</span>
                      </div>
                      <div className="flex h-full items-center">
                        <span>
                            <div className="flex gap-4 flex-wrap">
                          {
                            attachFiles
                            .sort((a, b) => new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime()) // Sắp xếp trước khi render
                            .map((file, index) => {
                              let filePreview;
                              const uploadDate = new Date(file.uploadedDate).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replace("am", "AM")
                              .replace("pm", "PM");

                              if (file.type.startsWith("image/")) {
                                filePreview = <img src={file.url} alt={file.name} className="w-full h-full object-cover"/>;
                              } else if (file.type === "application/pdf") {
                                filePreview = <img src={pdfImg} alt="PDF" className="w-full h-full object-contain"/>;
                              } else if (
                                  file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                  file.type === "application/vnd.ms-excel"
                              ) {
                                filePreview = <img src={xlsxImg} alt="Excel" className="w-full h-full object-contain"/>;
                              } else {
                                filePreview = <img src={otherImg} alt="Other" className="w-full h-full object-contain"/>;
                              }

                              return (
                                  <div key={index} className="w-36 bg-gray-800 rounded-lg overflow-hidden relative group">
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                                        <Button size="ssm" className="bg-zinc-500 hover:bg-zinc-400 rounded">
                                          <Download/>
                                        </Button>
                                      </a>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                              size="ssm"
                                              className="bg-zinc-500 hover:bg-red-500 rounded"
                                          >
                                            <Trash2/>
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This file will be permanently deleted and CANNOT BE UNDONE.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteAttachFile(file.name)}>Delete</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>

                                    <div className="w-36 h-28 flex items-center justify-center">{filePreview}</div>

                                    <div className="p-2">
                                      <p className="text-xs text-white truncate w-full" title={file.name}>
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-400">{uploadDate}</p>
                                    </div>
                                  </div>
                              );
                            })
                          }
                            </div>
                        </span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle/>
              <ResizablePanel defaultSize={40} className="h-[80vh] md:min-w-[15vw]">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={10} className="md:min-h-[8vh] md:max-h-[8vh]">
                    <ScrollArea className="h-full w-full p-2">
                      <div className="flex h-full items-center">
                        <Select>
                          <SelectTrigger className="w-[180px] bg-zinc-800">
                            <SelectValue placeholder="Theme"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle/>
                  <ResizablePanel defaultSize={90}>
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">

                        <div className="w-full border rounded bg-zinc-950 text-white">
                          <button
                              className="flex justify-between items-center w-full px-4 py-2 text-lg font-bold bg-zinc-950 hover:bg-zinc-800 rounded"
                              onClick={() => setIsOpen(!isOpen)}
                          >
                            Details
                            <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                          </button>

                          <div
                              className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                                  isOpen ? "max-h-96" : "max-h-0"
                              }`}
                          >
                            <div className="p-4 border-t border-gray-700 grid grid-cols-[1fr_2.5fr] grid-rows-6 gap-4">
                              <div className="grid grid-rows-6 gap-2">
                                <p className="flex items-center"><strong>Assignee:</strong></p>
                                <p className="flex items-center"><strong>Labels:</strong></p>
                                <p className="flex items-center"><strong>Parent:</strong></p>
                                <p className="flex items-center row-span-2"><strong>Development:</strong></p> {/* Chiếm 2 hàng */}
                                <p className="flex items-center"><strong>Reporter:</strong></p>
                              </div>

                              <div className="grid grid-rows-6 gap-2 text-gray-300">
                                <p className="flex items-center hover:bg-zinc-800 p-1 rounded-s">
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                </p>
                                <p className="flex items-center hover:bg-zinc-800 p-1 rounded-s">None</p>
                                <p className="flex items-center hover:bg-zinc-800 p-1 rounded-s">None</p>
                                <div className="flex flex-col justify-center row-span-2">
                                  <p className="hover:bg-zinc-800 p-1 py-2 rounded-s">Create branch</p>
                                  <p className="hover:bg-zinc-800 p-1 py-2 rounded-s">Create commit</p>
                                </div>
                                <p className="flex items-center hover:bg-zinc-800 p-1 rounded-s">Khoa Nguyen</p>
                              </div>
                            </div>
                          </div>
                        </div>
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
