"use client";

import AdminLayout from "@/app/components/Layout/AdminLayout";
import { useTranslations } from "@/app/providers/I18nProvider";
import { useAdminDataStore } from "@/app/store/adminDataStore";
import { getAdminTableMeta } from "@/app/admin/data/table-config";
import { useEffect, useMemo, useState } from "react";
import AdminDataTitle from "../components/AdminDataTitle";
import AdminDataList from "../components/AdminDataList";
import AdminDataFormDialog from "../components/AdminDataFormDialog";

type AdminDataPageProps = {
  table: string;
  titleKey: string;
};

export default function AdminDataPage({ table, titleKey }: AdminDataPageProps) {
  const { t } = useTranslations();
  const init = useAdminDataStore((state) => state.init);
  const getPageInfo = useAdminDataStore((state) => state.getPageInfo);
  const getList = useAdminDataStore((state) => state.getList);
  const setLoading = useAdminDataStore((state) => state.setLoading);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | undefined>();

  const config = useMemo(() => getAdminTableMeta(table), [table]);

  useEffect(() => {
    init(table);
  }, [table, init]);

  const handleAdd = () => {
    setFormMode("create");
    setEditId(undefined);
    setFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setFormMode("edit");
    setEditId(id);
    setFormOpen(true);
  };

  const handleSaved = async () => {
    setLoading(true);
    await getPageInfo();
    await getList();
    setLoading(false);
  };

  if (!config) return null;

  return (
    <AdminLayout>
      <div className="mx-auto my-4 w-full px-0 md:my-10 sm:px-4">
        <div className="app-panel w-full">
          <AdminDataTitle
            title={t(titleKey)}
            table={table}
            filterFields={config.filterFields}
            onAdd={handleAdd}
          />
          <AdminDataList columns={config.listColumns} onEdit={handleEdit} />
        </div>
      </div>

      <AdminDataFormDialog
        open={formOpen}
        mode={formMode}
        recordId={editId}
        fields={config.fields}
        defaultValues={config.defaultValues}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
    </AdminLayout>
  );
}
