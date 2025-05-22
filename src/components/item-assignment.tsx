import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Assignment, AssignmentRequest } from "@/models/Assignment.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import JoditEditor from "jodit-react";
import {
  deleteAssignment,
  getStatusType,
  updateAssignment,
} from "@/services/assignmentService.ts";
import {
  download,
  getAttachFileNames,
  getUploadedDate,
  upload,
  deleteByFileName,
} from "@/services/mediaService.ts";
import { BASE_API_URL } from "@/utils/api.ts";
import pdfImg from "@/assets/imgs/pdf.png";
import xlsxImg from "@/assets/imgs/xlsx.png";
import otherImg from "@/assets/imgs/other.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { MediaRequest } from "@/models/Media.ts";
import { User } from "@/models/User.ts";
import { getUsers } from "@/services/userService.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { BsThreeDots } from "react-icons/bs";
import tokenService from "@/services/tokenService.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

interface Props {
  assignment: Assignment;
  isOverlay?: boolean;
  removeAssignment: (assignmentId: string) => void;
  onUpdate?: (updatedAssignment: Assignment) => void;
}

export type AssignmentType = "Assignment";

export interface AssignmentDragData {
  type: AssignmentType;
  assignment: Assignment;
}

export function ItemAssignment({
  assignment,
  isOverlay,
  removeAssignment,
  onUpdate,
}: Props) {
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
  const [attachFiles, setAttachFiles] = useState<
    { url: string; type: string; name: string; uploadedDate: Date }[]
  >([]);
  const didFetch = useRef(false);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [fileNames, setFileNames] = useState<{ name: string; blob: string }[]>(
    []
  );
  const [localAssignment, setLocalAssignment] = useState(assignment);
  const hasUpdatedStatus = useRef(false);
  const [status, setStatus] = useState<string>(assignment.status_type);
  const [statusList, setStatusList] = useState<string[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const statusColorMap = {
    DONE: "bg-green-900",
    IN_PROGRESS: "bg-yellow-600",
    EXPIRED: "bg-red-900",
    NOT_START: "bg-gray-600",
  };

  const textColorMap = {
    DONE: "text-white",
    IN_PROGRESS: "text-white",
    EXPIRED: "text-white",
    NOT_START: "text-white",
    undefined: "text-gray-500",
  };

  // Hàm parse ngày giờ từ BE (định dạng dd/MM/yyyy HH:mm:ss)
  const parseDate = (dateString?: string): Date | null => {
    if (!dateString) return null;

    try {
      const date = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", dateString);
        return null;
      }
      return date;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Received assignment:", assignment);
    console.log(
      "assignment.statusType for id",
      assignment.id,
      ":",
      assignment.status_type
    );
    if (!hasUpdatedStatus.current) {
      setStatus(assignment.status_type);
    }
    setLocalAssignment(assignment);
    setStartDate(parseDate(assignment.start_date));
    setEndDate(parseDate(assignment.end_date));
  }, [assignment]);

  const formatStatusText = (status: string | undefined) => {
    if (!status) {
      return "Not Set";
    }
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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
        };

        download(mediaRequest)
          .then(async (response) => {
            const uploadedDate = await getUploadedDate(file.name);

            if (response && uploadedDate) {
              setAttachFiles((prev) => [
                ...prev,
                {
                  url: URL.createObjectURL(response),
                  type: file.type,
                  name: file.name,
                  uploadedDate: uploadedDate,
                },
              ]);
            } else {
              console.error("No image data received");
            }
          })
          .catch((error) => {
            console.error("Error download image:", error);
          });
      });
    }
  };

  const handleContentChange = () => {
    setIsEditing(false);

    const parser = new DOMParser();
    const changedContent = parser.parseFromString(content, "text/html");

    changedContent.querySelectorAll("img").forEach((img) => {
      const matchedFile = fileNames.find((file) => file.blob === img.src);
      if (matchedFile) {
        img.src = matchedFile.name;
      }
    });

    const assignmentRequest: AssignmentRequest = {
      title: assignment.title,
      description: changedContent.body.innerHTML,
      assignmentOrder: assignment.assignmentOrder,
      taskId: assignment.task.id,
      assignerId: assignment.assigner.id,
      receiverId: assignment.receiver?.id ?? "",
      start_date: startDate
        ? format(startDate, "dd/MM/yyyy HH:mm:ss")
        : undefined,
      end_date: endDate ? format(endDate, "dd/MM/yyyy HH:mm:ss") : undefined,
    };

    updateAssignment(assignment.id, assignmentRequest)
      .then(() => {
        console.log("Assignment updated successfully");
        const updatedAssignment = {
          ...localAssignment,
          description: changedContent.body.innerHTML,
          start_date: startDate
            ? format(startDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
          end_date: endDate
            ? format(endDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
        };
        setLocalAssignment(updatedAssignment);
        if (onUpdate) {
          onUpdate(updatedAssignment);
        }
      })
      .catch((error) => console.error("Error in update assignment:", error));
  };

  const handleAssign = (selectedUserId: string) => {
    const assignmentRequest: AssignmentRequest = {
      title: localAssignment.title,
      assignmentOrder: localAssignment.assignmentOrder,
      taskId: localAssignment.task.id,
      assignerId: localAssignment.assigner.id,
      receiverId: selectedUserId,
      status_type: status,
      start_date: startDate
        ? format(startDate, "dd/MM/yyyy HH:mm:ss")
        : undefined,
      end_date: endDate ? format(endDate, "dd/MM/yyyy HH:mm:ss") : undefined,
    };

    updateAssignment(localAssignment.id, assignmentRequest)
      .then(() => {
        const newReceiver = users.find((u) => u.id === selectedUserId);
        if (newReceiver) {
          const updatedAssignment = {
            ...localAssignment,
            receiver: newReceiver,
            start_date: startDate
              ? format(startDate, "dd/MM/yyyy HH:mm:ss")
              : undefined,
            end_date: endDate
              ? format(endDate, "dd/MM/yyyy HH:mm:ss")
              : undefined,
          };
          setLocalAssignment(updatedAssignment);
          if (onUpdate) {
            onUpdate(updatedAssignment);
          }
        }
      })
      .catch((error) => console.error("Error in update assignment:", error));
  };

  const editor = useRef(null);
  const [content, setContent] = useState<string>(assignment.description);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const editorConfig = useMemo(
    () => ({
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
        headers: {
          Authorization: `Bearer ${tokenService.accessToken}`,
        },
        url: `${BASE_API_URL}medias`,
        prepareData: function (formData: FormData) {
          formData.append("assignmentId", assignment.id);
          formData.append("projectName", assignment.task.project.name);
          formData.append("isContent", "true");
          return formData;
        },
        filesVariableName: () => "file",
        isSuccess: function (response: any) {
          return response && typeof response === "object" && response.fileName;
        },
        getMessage: function (response: any) {
          return response.message || "Upload error";
        },
        process: async function (response: any) {
          if (!response || !response.fileName) {
            console.error("Invalid response:", response);
            return { files: [] };
          }

          const mediaRequest: MediaRequest = {
            projectName: assignment.task.project.name,
            fileName: response.fileName,
          };

          const blob = await download(mediaRequest);
          const url = URL.createObjectURL(blob!);

          setFileNames((prev) => [
            ...prev,
            { name: mediaRequest.fileName!, blob: url },
          ]);

          setContent(
            (prev) =>
              prev +
              `<img src=${url} alt=${response.fileName
                .split("_")
                .slice(1)
                .join()} >`
          );

          return {
            files: [],
            baseurl: "",
            isImages: [true],
          };
        },
      },
    }),
    []
  );

  useEffect(() => {
    const parser = new DOMParser();
    const initContent = parser.parseFromString(content, "text/html");

    getUsers()
      .then((response) => {
        setUsers(response ?? []);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });

    initContent.querySelectorAll("img").forEach((img) => {
      const mediaRequest: MediaRequest = {
        projectName: assignment.task.project.name,
        fileName: decodeURIComponent(img.src.split("/").slice(5).join("/")),
      };

      download(mediaRequest)
        .then((response) => {
          const blobUrl = URL.createObjectURL(response!);
          img.src = blobUrl;
          setFileNames((prev) => [
            ...prev,
            { name: mediaRequest.fileName!, blob: blobUrl },
          ]);

          if (initContent.body.innerHTML !== content) {
            setContent(initContent.body.innerHTML);
          }
        })
        .catch((error) => {
          console.error("Error download image:", error);
        });
    });
  }, []);

  useEffect(() => {
    setContent(content);
  }, [content]);

  const handleDeleteAttachFile = async (fileName: string) => {
    setAttachFiles((prev) => prev.filter((file) => file.name !== fileName));

    const mediaRequest: MediaRequest = {
      projectName: assignment.task.project.name,
      assignmentId: assignment.id,
      fileName: fileName,
    };

    await deleteByFileName(mediaRequest);
  };

  const handleDeleteAssignment = async () => {
    removeAssignment(assignment.id);
    await deleteAssignment(assignment.id);
    setIsAssignmentOpen(false);
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    setAttachFiles([]);

    const mediaRequest: MediaRequest = {
      projectName: assignment.task.project.name,
      assignmentId: assignment.id,
    };

    getAttachFileNames(mediaRequest)
      .then((response) => {
        response?.map((fileName) => {
          mediaRequest.fileName = fileName;

          download(mediaRequest)
            .then(async (response) => {
              const uploadedDate = await getUploadedDate(
                fileName.split("_").slice(2).join("_")
              );

              if (response && uploadedDate) {
                setAttachFiles((prev) => [
                  ...prev,
                  {
                    url: URL.createObjectURL(response),
                    type: response.type,
                    name: fileName.split("_").slice(2).join("_"),
                    uploadedDate: uploadedDate,
                  },
                ]);
              } else {
                console.error("No image data received");
              }
            })
            .catch((error) => {
              console.error("Error fetching image:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching attach file name:", error);
      });
  }, [attachFiles]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setIsLoadingStatuses(true);
        const statuses = await getStatusType();
        if (statuses) {
          setStatusList(statuses);
          console.log("Fetched statuses:", statuses);
        } else {
          console.error("No statuses received from API");
          setStatusList([]);
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        setStatusList([]);
      } finally {
        setIsLoadingStatuses(false);
      }
    };

    fetchStatuses();
  }, []);

  const handleStatusChange = (value: string) => {
    if (!localAssignment.title) {
      console.error("Title cannot be blank");
      setAlertMessage(
        "Please fill in all required information: Title cannot be blank."
      );
      setIsAlertOpen(true);
      return;
    }
    if (!localAssignment.task.id) {
      console.error("Task ID cannot be blank");
      setAlertMessage(
        "Please fill in all required information: Task ID cannot be blank."
      );
      setIsAlertOpen(true);
      return;
    }
    if (localAssignment.assignmentOrder < 1) {
      console.error("Assignment order must be at least 1");
      setAlertMessage(
        "Please fill in all required information: Assignment order must be at least 1."
      );
      setIsAlertOpen(true);
      return;
    }
    if (!localAssignment.receiver || !localAssignment.receiver.id) {
      console.error("Receiver cannot be blank");
      setAlertMessage(
        "Please fill in all required information: Receiver cannot be blank."
      );
      setIsAlertOpen(true);
      return;
    }
    if (endDate && startDate && endDate < startDate) {
      console.error("End date cannot be before start date");
      setAlertMessage("End date cannot be before start date.");
      setIsAlertOpen(true);
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      console.error("Start date cannot be after end date");
      setAlertMessage("Start date cannot be after end date.");
      setIsAlertOpen(true);
      return;
    }

    const assignmentRequest: AssignmentRequest = {
      title: localAssignment.title,
      description: localAssignment.description || "",
      assignmentOrder: localAssignment.assignmentOrder,
      taskId: localAssignment.task.id,
      assignerId: localAssignment.assigner.id || "",
      receiverId: localAssignment.receiver.id,
      status_type: value,
      start_date: startDate
        ? format(startDate, "dd/MM/yyyy HH:mm:ss")
        : undefined,
      end_date: endDate ? format(endDate, "dd/MM/yyyy HH:mm:ss") : undefined,
    };
    console.log("Sending assignmentRequest:", assignmentRequest);
    console.log("Access token:", tokenService.accessToken);
    console.log("Current status before update:", status);
    console.log("Updating status to:", value);

    updateAssignment(localAssignment.id, assignmentRequest)
      .then(() => {
        console.log("Assignment updated successfully, new status:", value);
        const updatedAssignment = {
          ...localAssignment,
          status_type: value,
          start_date: startDate
            ? format(startDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
          end_date: endDate
            ? format(endDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
        };
        setStatus(value);
        setLocalAssignment(updatedAssignment);
        hasUpdatedStatus.current = true;
        console.log("Updated status state:", value);
        if (onUpdate) {
          onUpdate(updatedAssignment);
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        setStatus(localAssignment.status_type || "IN_PROGRESS");
        hasUpdatedStatus.current = false;
      });
  };

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    // Kiểm tra validation trước khi cập nhật trạng thái
    if (type === "start") {
      if (date && endDate && date > endDate) {
        console.error("Start date cannot be after end date");
        setAlertMessage("Start date cannot be after end date.");
        setIsAlertOpen(true);
        return;
      }
      setStartDate(date); // Chỉ cập nhật nếu validation thành công
    } else {
      if (date && startDate && date < startDate) {
        console.error("End date cannot be before start date");
        setAlertMessage("End date cannot be before start date.");
        setIsAlertOpen(true);
        return;
      }
      setEndDate(date); // Chỉ cập nhật nếu validation thành công
    }

    // Gửi request nếu có ít nhất một ngày được chọn
    if (startDate || date || endDate) {
      const assignmentRequest: AssignmentRequest = {
        title: localAssignment.title,
        description: localAssignment.description || "",
        assignmentOrder: localAssignment.assignmentOrder,
        taskId: localAssignment.task.id,
        assignerId: localAssignment.assigner.id || "",
        receiverId: localAssignment.receiver?.id || "",
        status_type: status,
        start_date:
          type === "start" && date
            ? format(date, "dd/MM/yyyy HH:mm:ss")
            : startDate
            ? format(startDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
        end_date:
          type === "end" && date
            ? format(date, "dd/MM/yyyy HH:mm:ss")
            : endDate
            ? format(endDate, "dd/MM/yyyy HH:mm:ss")
            : undefined,
      };

      console.log(
        "Sending assignmentRequest for date update:",
        assignmentRequest
      );

      updateAssignment(localAssignment.id, assignmentRequest)
        .then(() => {
          console.log("Assignment dates updated successfully");
          const updatedAssignment = {
            ...localAssignment,
            start_date:
              type === "start" && date
                ? format(date, "dd/MM/yyyy HH:mm:ss")
                : startDate
                ? format(startDate, "dd/MM/yyyy HH:mm:ss")
                : undefined,
            end_date:
              type === "end" && date
                ? format(date, "dd/MM/yyyy HH:mm:ss")
                : endDate
                ? format(endDate, "dd/MM/yyyy HH:mm:ss")
                : undefined,
          };
          setLocalAssignment(updatedAssignment);
          if (onUpdate) {
            onUpdate(updatedAssignment);
          }
        })
        .catch((error) => {
          console.error("Error updating dates:", error);
          setAlertMessage("Failed to update dates. Please try again.");
          setIsAlertOpen(true);
        });
    }
  };

  // Hàm kiểm tra xem Receiver đã được chọn hay chưa
  const isReceiverSelected = () => {
    return localAssignment.receiver && localAssignment.receiver.id;
  };

  // Hàm xử lý khi người dùng cố mở DatePicker mà chưa chọn Receiver
  const handleCalendarOpen = (type: "start" | "end") => {
    if (!isReceiverSelected()) {
      setAlertMessage(
        `Please select a Receiver before choosing the ${
          type === "start" ? "start" : "end"
        } date.`
      );
      setIsAlertOpen(true);
    }
  };

  console.log("Rendering with status for id", assignment.id, ":", status);

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`${
          statusColorMap[status as keyof typeof statusColorMap]
        } ${variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}`}
      >
        <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move assignment</span>
            <GripVertical />
          </Button>
          <div className="ml-auto flex gap-2">
            <Badge
              variant={"outline"}
              className={`font-semibold ${
                textColorMap[status as keyof typeof textColorMap] ||
                textColorMap.undefined
              }`}
            >
              {formatStatusText(status)}
            </Badge>
          </div>
        </CardHeader>

        <Dialog
          modal={false}
          open={isAssignmentOpen}
          onOpenChange={setIsAssignmentOpen}
        >
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
              <ResizablePanel
                defaultSize={60}
                className="h-[85vh] md:min-w-[25vw]"
              >
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={10}
                    className="md:min-h-[8vh] md:max-h-[8vh]"
                  >
                    <div className="h-full flex items-center pl-4">
                      <span className="font-semibold text-2xl">
                        {assignment.title}
                      </span>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
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
                        {!isEditing ? (
                          <div
                            className={`border p-2 cursor-pointer w-full rounded text-gray-400 hover:bg-sidebar-accent duration-200 ${
                              content ? "" : "italic"
                            }`}
                            onClick={() => setIsEditing(true)}
                            dangerouslySetInnerHTML={{
                              __html:
                                content ||
                                "<p>Click here to start writing...</p>",
                            }}
                          />
                        ) : (
                          <div>
                            <JoditEditor
                              config={editorConfig}
                              ref={editor}
                              value={content}
                              onChange={(newContent) => setContent(newContent)}
                            />
                            <button
                              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                              onClick={handleContentChange}
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex h-full items-center pb-1">
                        <span className="font-bold">Attachments</span>
                      </div>
                      <div className="flex h-full items-center">
                        <span>
                          <div className="flex gap-4 flex-wrap">
                            {attachFiles
                              .sort(
                                (a, b) =>
                                  new Date(a.uploadedDate).getTime() -
                                  new Date(b.uploadedDate).getTime()
                              )
                              .map((file, index) => {
                                let filePreview;
                                const uploadDate = new Date(file.uploadedDate)
                                  .toLocaleString("en-GB", {
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
                                  filePreview = (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  );
                                } else if (file.type === "application/pdf") {
                                  filePreview = (
                                    <img
                                      src={pdfImg}
                                      alt="PDF"
                                      className="w-full h-full object-contain"
                                    />
                                  );
                                } else if (
                                  file.type ===
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                  file.type === "application/vnd.ms-excel"
                                ) {
                                  filePreview = (
                                    <img
                                      src={xlsxImg}
                                      alt="Excel"
                                      className="w-full h-full object-contain"
                                    />
                                  );
                                } else {
                                  filePreview = (
                                    <img
                                      src={otherImg}
                                      alt="Other"
                                      className="w-full h-full object-contain"
                                    />
                                  );
                                }

                                return (
                                  <div
                                    key={index}
                                    className="w-36 bg-gray-800 rounded-lg overflow-hidden relative group"
                                  >
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <a
                                        href={file.url}
                                        download={file.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button
                                          size="ssm"
                                          className="bg-zinc-500 hover:bg-zinc-400 rounded"
                                        >
                                          <Download />
                                        </Button>
                                      </a>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            size="ssm"
                                            className="bg-zinc-500 hover:bg-red-500 rounded"
                                          >
                                            <Trash2 />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This file will be permanently
                                              deleted and CANNOT BE UNDONE.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDeleteAttachFile(
                                                  file.name
                                                )
                                              }
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                    <div className="w-36 h-28 flex items-center justify-center">
                                      {filePreview}
                                    </div>
                                    <div className="p-2">
                                      <p
                                        className="text-xs text-white truncate w-full"
                                        title={file.name}
                                      >
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {uploadDate}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </span>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={40}
                className="h-[80vh] md:min-w-[15vw]"
              >
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={10}
                    className="md:min-h-[8vh] md:max-h-[8vh]"
                  >
                    <ScrollArea className="h-full w-full py-2 px-4">
                      <div className="flex h-full items-center justify-between">
                        <Select
                          onValueChange={handleStatusChange}
                          value={status}
                          disabled={isLoadingStatuses}
                        >
                          <SelectTrigger className="w-[180px] bg-zinc-800">
                            <SelectValue
                              placeholder={
                                isLoadingStatuses
                                  ? "Loading..."
                                  : "Select Status"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingStatuses ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              statusList.map((statusItem) => (
                                <SelectItem key={statusItem} value={statusItem}>
                                  {statusItem.replace("_", " ").toLowerCase()}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              <BsThreeDots />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40">
                            <DropdownMenuItem onClick={handleDeleteAssignment}>
                              <Trash2 />
                              <span className="cursor-pointer">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={90}>
                    <ScrollArea className="h-full w-full p-4">
                      <div className="flex h-full items-center">
                        <div className="w-full border rounded bg-zinc-950 text-white">
                          <button
                            className="flex justify-between items-center w-full px-4 py-2 text-lg font-bold bg-zinc-950 hover:bg-zinc-800 rounded"
                            onClick={() => setIsLeftOpen(!isLeftOpen)}
                          >
                            Details
                            <span
                              className={`transition-transform ${
                                isLeftOpen ? "rotate-180" : ""
                              }`}
                            >
                              ▼
                            </span>
                          </button>
                          <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                              isLeftOpen ? "max-h-96" : "max-h-0"
                            }`}
                          >
                            <div className="p-4 border-t border-gray-700 grid grid-cols-[1fr_2.5fr] grid-rows-6 gap-4">
                              <div className="grid grid-rows-6 gap-2">
                                <p className="flex items-center">
                                  <strong>Receiver:</strong>
                                </p>
                                <p className="flex items-center">
                                  <strong>Start Date:</strong>
                                </p>
                                <p className="flex items-center">
                                  <strong>End Date:</strong>
                                </p>
                              </div>
                              <div className="grid grid-rows-6 gap-2 text-gray-300">
                                <p className="flex items-center p-1 rounded-s">
                                  <Select onValueChange={handleAssign}>
                                    <SelectTrigger className="w-[20vw]">
                                      <SelectValue
                                        placeholder={
                                          localAssignment.receiver
                                            ? `${localAssignment.receiver.name} (${localAssignment.receiver.username})`
                                            : "Unassigned"
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {users.map((user) => (
                                        <SelectItem
                                          value={user.id}
                                          key={user.id}
                                        >
                                          {user.name} ({user.username})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </p>
                                <p className="flex items-center p-1 rounded-s">
                                  <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) =>
                                      handleDateChange(date, "start")
                                    }
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect
                                    timeFormat="HH:mm:ss"
                                    timeIntervals={1}
                                    className="w-[20vw] bg-zinc-800 text-gray-300 p-2 rounded"
                                    placeholderText="Select start date and time"
                                    disabled={!isReceiverSelected()}
                                    onCalendarOpen={() =>
                                      handleCalendarOpen("start")
                                    }
                                  />
                                </p>
                                <p className="flex items-center p-1 rounded-s">
                                  <DatePicker
                                    selected={endDate}
                                    onChange={(date: Date | null) =>
                                      handleDateChange(date, "end")
                                    }
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect
                                    timeFormat="HH:mm:ss"
                                    timeIntervals={1}
                                    className="w-[20vw] bg-zinc-800 text-gray-300 p-2 rounded"
                                    placeholderText="Select end date and time"
                                    disabled={!isReceiverSelected()}
                                    onCalendarOpen={() =>
                                      handleCalendarOpen("end")
                                    }
                                  />
                                </p>
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertMessage.includes("Receiver")
                ? "Receiver Required"
                : "Invalid Date Range"}
            </AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
