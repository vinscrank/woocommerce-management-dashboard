import { components } from "./Global";

interface MediaSize {
  file: string;
  width: number;
  height: number;
  filesize?: number;
  mime_type: string;
  source_url: string;
  uncropped?: boolean;
}

interface ImageMeta {
  aperture: string;
  credit: string;
  camera: string;
  caption: string;
  created_timestamp: string;
  copyright: string;
  focal_length: string;
  iso: string;
  shutter_speed: string;
  title: string;
  orientation: string;
  keywords: string[];
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  filesize: number;
  sizes: Record<string, MediaSize>;
  image_meta: ImageMeta;
}

export type Media = Omit<components["schemas"]["WordpressMediaResponse"], 'mediaDetails'> & {
  name?: string;
  size?: number;
  src?: string;
  mediaDetails?: MediaDetails;
};