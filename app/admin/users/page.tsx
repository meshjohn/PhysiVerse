import { adminGetUsers } from "@/app/data/admin/admin-get-users";
import { DataTableUsers } from "./_components/TableUsersPage";

export default async function AdminUsersPage() {
  const users = await adminGetUsers();
  return <DataTableUsers serverData={users} />;
}