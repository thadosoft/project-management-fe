export interface ReferenceProfileRequest {
    name: string;
    module: number;
    description: string;
    referenceFiles: ReferenceFileRequest[];
    referenceLinks: ReferenceLinkRequest[];
}

export interface ReferenceFileRequest {
    referenceProfileId: number;
    fileData: Uint8Array;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
}

export interface ReferenceLinkRequest {
    link: string;
    description: string;
}
