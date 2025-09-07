"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { tryCatch } from "@/hooks/try-catch"
import { deleteUser } from "../action"
import { useRouter } from "next/navigation"

type Role = "user" | "admin";

export type Users = {
  id: string
  email: string,
  name: string,
  createdAt: Date,
  role: Role,
}

export const columns: ColumnDef<Users>[] = [
 {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
        className="pl-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Joined</div>,
    cell: ({ row }) => {
      const date = row.getValue("createdAt")
      let formattedDate = "";
      if (date instanceof Date) {
        formattedDate = date.toLocaleDateString();
      } else if (typeof date === "string" || typeof date === "number") {
        formattedDate = new Date(date).toLocaleDateString();
      } else {
        formattedDate = String(date);
      }

      return <div className="text-right font-medium">{formattedDate}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button className="hover:bg-transparent!" variant="ghost" onClick={async () => {
           const confirmed = window.confirm("Are you sure you want to delete this user?");
          if (!confirmed) return;
          const { data: result, error } = await tryCatch(deleteUser(row.original.id));
          if (error) {
            toast.error("An unexpected error occurred. Please try again.");
            return;
          }
          if (result.status === "success") {
            toast.success(result.message);
            location.reload();
        } else if (result.status === "error") {
            toast.error(result.message);
          }
        }}
      >
            <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )
    },
  },
]

export function DataTableUsers({ serverData }: { serverData: Users[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [data, setData] = React.useState(serverData)

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
  React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
    const [filterValue, setFilterValue] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();

 const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter: filterValue,
  },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  onGlobalFilterChange: setFilterValue,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: (row, columnId, filterValue) => {
    // Simple case-insensitive match on name or email
    const name = row.original.name?.toLowerCase() ?? "";
    const email = row.original.email?.toLowerCase() ?? "";
    const search = filterValue.toLowerCase();

    return name.includes(search) || email.includes(search);
  },
})


  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
  placeholder="Filter name or email..."
  value={filterValue}
onChange={(event) => {
  table.setGlobalFilter(event.target.value);
}}
  className="max-w-sm"
/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          The no. of users: {data.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
