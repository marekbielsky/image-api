export interface CreateImageEntityProps {
  title: string;
  url: string;
  width: number;
  height: number;
}

export interface FindImagesParams {
  title?: string;
  page: number;
  limit: number;
}
