import { convertToFaNum } from "@/lib/convertToFaNum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { SuccessResponse } from "@/lib/fetch";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";

type TableFooterProps = {
  pagination: SuccessResponse<MusicType>["paginate"];
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
  pageNumbers: (string | number)[];
  currentPage: number;
  currentPageSize: number;
};

const TableFooter = ({
  pagination,
  onPageSizeChange,
  onPageChange,
  pageNumbers,
  currentPage,
  currentPageSize,
}: TableFooterProps) => {
  return (
    <div className="flex items-center justify-between w-full py-8 px-6">
      <div className="flex items-center w-1/2 gap-2 ">
        <Select
          value={`${currentPageSize}`}
          onValueChange={(value) => {
            onPageSizeChange(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={convertToFaNum(pagination.per_page)} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {convertToFaNum(pageSize)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium"> / در هر صفحه </p>
      </div>

      <Pagination className="w-1/2 justify-end" dir="rtl">
        <PaginationContent>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(pagination.current_page + 1)}
              className={
                pagination.current_page >= pagination.last_page
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={pagination.current_page === page}
                  className="cursor-pointer"
                >
                  {convertToFaNum(page as number)}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                onPageChange(currentPage - 1);
              }}
              className={
                pagination.current_page <= 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TableFooter;
