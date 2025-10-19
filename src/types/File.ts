export interface File {
  id: number;
  name: string;
  new_name?: string;
  size: number;
  creationTime: string;
  lastModified: string;
  path: string;
} 