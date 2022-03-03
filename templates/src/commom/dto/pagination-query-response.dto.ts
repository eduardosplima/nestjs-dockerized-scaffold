export abstract class PaginationQueryResponseDto {
  abstract content: unknown[];

  totalRecords: number;

  totalPages: number;

  currentPage: number;

  pageSize: number;
}
