"use client";

import React, { memo, useState } from "react";
import { useAdminDataStore } from "@/app/store/adminDataStore";
import LoadingSkeleton from "@/app/components/Loading/loadingSkeleton";
import EmptyData from "@/app/components/Alert/EmptyData";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import PaginationNew from "@/app/components/Navbars/PaginationNew";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import {
  formatAdminCell,
  getAdminCellMax,
  getAdminListCellValue,
  isSentenceColumn,
} from "@/app/admin/data/table-config";
import { isEmpty } from "lodash";

type AdminDataListProps = {
  columns: string[];
  onEdit: (id: string) => void;
};

const AdminDataList = ({ columns, onEdit }: AdminDataListProps) => {
  const { t } = useTranslations();
  const rows = useAdminDataStore((state) => state.rows);
  const pageInfo = useAdminDataStore((state) => state.pageInfo);
  const isLoading = useAdminDataStore((state) => state.isLoading);
  const table = useAdminDataStore((state) => state.table);
  const setPageInfo = useAdminDataStore((state) => state.setPageInfo);
  const getPageInfo = useAdminDataStore((state) => state.getPageInfo);
  const getList = useAdminDataStore((state) => state.getList);
  const setLoading = useAdminDataStore((state) => state.setLoading);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handlePageChange = async (newPageNo: number) => {
    if (!pageInfo || newPageNo === pageInfo.currentPage) return;
    setLoading(true);
    setPageInfo({ currentPage: newPageNo });
    await getList();
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data/${table}/${deleteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setResultMsg(t("admin.deleteSuccess"));
        setShowResult(true);
        await getPageInfo();
        await getList();
      } else {
        setResultMsg(data.message || t("admin.saveFailed"));
        setShowResult(true);
      }
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-panel-body">
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="app-board-table min-w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className={
                      isSentenceColumn(column)
                        ? "min-w-[10rem] whitespace-nowrap"
                        : "whitespace-nowrap"
                    }
                  >
                    {t(`admin.fields.${column}`)}
                  </th>
                ))}
                <th className="w-28 whitespace-nowrap">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="!p-0">
                    <LoadingSkeleton />
                  </td>
                </tr>
              ) : isEmpty(rows) ? (
                <tr>
                  <td colSpan={columns.length + 1} className="!p-6">
                    <EmptyData />
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const id = String(row._id || row.id || "");
                  return (
                    <tr key={id}>
                      {columns.map((column) => {
                        const raw = getAdminListCellValue(table, column, row);
                        const text = formatAdminCell(raw, getAdminCellMax(column));
                        return (
                          <td
                            key={column}
                            className={
                              isSentenceColumn(column)
                                ? "min-w-[10rem] max-w-[20rem] truncate text-sm"
                                : "max-w-48 truncate text-sm"
                            }
                            title={typeof raw === "string" ? raw : text}
                          >
                            {text}
                          </td>
                        );
                      })}
                      <td>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => setEditId(id)}
                          >
                            {t("admin.edit")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(id)}
                          >
                            {t("admin.delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <PaginationNew
          pageInfo={pageInfo}
          onPageChange={(newPage) => handlePageChange(newPage)}
        />
      </div>

      <ModalConfirm
        type="warning"
        message={t("admin.editConfirm")}
        visible={Boolean(editId)}
        showCancel
        onClose={() => setEditId(null)}
        onConfirm={() => {
          if (editId) onEdit(editId);
          setEditId(null);
        }}
      />

      <ModalConfirm
        type="warning"
        message={t("admin.deleteConfirm")}
        visible={Boolean(deleteId)}
        showCancel
        onClose={() => setDeleteId(null)}
        onConfirm={executeDelete}
      />

      <ModalConfirm
        type="info"
        message={resultMsg}
        visible={showResult}
        onClose={() => setShowResult(false)}
      />
    </>
  );
};

export default memo(AdminDataList);
