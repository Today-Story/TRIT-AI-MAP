export interface BaseResponseDTO<T> {
  data: T;
  status: number;
  statusText: string;
}
