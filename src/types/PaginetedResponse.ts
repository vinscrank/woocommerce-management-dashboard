export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  itemsInPage: number;
  totalItems: number;
  totalPages: number;
}
