"use client";

import ResponsivePagination from "react-responsive-pagination";
import { useTranslations } from "@/app/providers/I18nProvider";

type PaginationNewProps = {
  pageInfo?: Paginate;
  onPageChange?: (newPage: number) => any;
  showMeta?: boolean;
};

const PaginationNew = (props: PaginationNewProps) => {
  const { pageInfo, onPageChange, showMeta = true } = props;
  const { t } = useTranslations();

  const {
    total = 0,
    totalPage = 0,
    currentPage = 1,
  } = pageInfo || {};

  const safeTotalPage = Math.max(totalPage || 0, 1);
  const safeCurrent = Math.min(Math.max(currentPage || 1, 1), safeTotalPage);

  const handlePageClick = (newPage: number) => {
    if (newPage === safeCurrent) return;
    if (newPage < 1 || newPage > safeTotalPage) return;
    onPageChange?.(newPage);
  };

  if (totalPage <= 0 && total <= 0) {
    return null;
  }

  return (
    <div className="app-paginate-wrap">
      {showMeta && (
        <p className="app-paginate-meta">
          {t("board.totalCount")}: {total.toLocaleString()} · {safeCurrent} /{" "}
          {safeTotalPage}
        </p>
      )}
      {totalPage > 1 && (
        <nav aria-label="pagination">
          <ResponsivePagination
            className="app-paginate"
            pageItemClassName="app-paginate-item"
            pageLinkClassName="app-paginate-link"
            activeItemClassName="is-active"
            disabledItemClassName="is-disabled"
            previousClassName="app-paginate-nav"
            nextClassName="app-paginate-nav"
            previousLabel={<i className="fas fa-chevron-left text-[0.65rem]" aria-hidden />}
            nextLabel={<i className="fas fa-chevron-right text-[0.65rem]" aria-hidden />}
            total={safeTotalPage}
            current={safeCurrent}
            onPageChange={handlePageClick}
            maxWidth={420}
            linkHref="omit"
          />
        </nav>
      )}
    </div>
  );
};

export default PaginationNew;
