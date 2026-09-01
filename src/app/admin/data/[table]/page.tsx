import { notFound } from "next/navigation";
import { getAdminDataItem } from "../config";
import AdminDataPage from "./AdminDataPage";

type PageProps = {
  params: Promise<{ table: string }>;
};

export default async function AdminDataTablePage({ params }: PageProps) {
  const { table } = await params;
  const item = getAdminDataItem(table);

  if (!item) {
    notFound();
  }

  return <AdminDataPage table={table} titleKey={item.key} />;
}
