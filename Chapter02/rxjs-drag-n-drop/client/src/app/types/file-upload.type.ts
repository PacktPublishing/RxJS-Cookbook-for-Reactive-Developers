export interface FileWithProgress extends File {
    progress?: number;
    error?: string;
    valid?: boolean;
}
