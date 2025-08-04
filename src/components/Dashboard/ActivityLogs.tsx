import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";


const ActivityLogs = ({ logs }: { logs: string[] }) => {

    const activities = [
        { status: 'success', level: 'Info', type: 'Server Restart', time: '۱۴۰۲/۱۲/۱۹, ۱۲:۰۴' },
        { status: 'pending', level: 'Warning', type: 'CPU Spike', time: '۱۴۰۲/۱۲/۱۹, ۱۲:۰۴' },
        { status: 'error', level: 'Critical', type: 'Disk Full', time: '۱۴۰۲/۱۲/۱۹, ۱۲:۰۴' },
        { status: 'pending', level: 'Warning', type: 'CPU Spike', time: '۱۴۰۲/۱۲/۱۹, ۱۲:۰۴' },
        { status: 'success', level: 'Info', type: 'Server Restart', time: '۱۴۰۲/۱۲/۱۹, ۱۲:۰۴' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-[#23B8461F] text-[#23B946]';
            case 'pending':
                return 'bg-[#FF9F431F] text-[#FF9F43]';
            case 'error':
                return 'bg-[#FF4C511F] text-[#FF4C51]';
            case 'error':
                return 'bg-[#FF4C511F] text-[#FF4C51]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTranslateStatus = (status: string) => {
        switch (status) {
            case 'success':
                return 'موفق';
            case 'pending':
                return 'در حال پایش';
            case 'error':
                return 'نیاز به اقدام';
            default:
                return 'نامشخص';
        }
    }
    const table = useReactTable({
        data: activities,
        columns: [
            {
                header: 'تاریخ و ساعت',
                accessorKey: 'time',
            },
            {
                header: 'نوع رویداد',
                accessorKey: 'type',
            },
            {
                header: 'سطح (Level)',
                accessorKey: 'level',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.getValue("status") as string
                    return <span className={`flex items-center justify-center rounded-lg max-w-[106px] py-2 text-xs ${getStatusColor(status)}`}>{getTranslateStatus(status)}</span>
                }
            },


        ],
        state: {
            sorting: [],
            columnFilters: [],
        },
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        // <Table className="">
        //     <TableHeader className="py-4! border-t-0!">
        //         {table.getHeaderGroups().map((headerGroup) => (
        //             <TableRow key={headerGroup.id}>
        //                 {headerGroup.headers.map((header, index) => {
        //                     return (
        //                         <TableHead
        //                             key={header.id + index}
        //                             className={`${header.id === "name" ? "text-right! px-10" : "text-center"
        //                                 } py-4! `}
        //                         >
        //                             {header.isPlaceholder
        //                                 ? null
        //                                 : flexRender(header.column.columnDef.header, header.getContext())}
        //                         </TableHead>
        //                     );
        //                 })}
        //             </TableRow>
        //         ))}
        //     </TableHeader>
        //     <TableBody>
        //         {table.getRowModel().rows?.length ? (
        //             table.getRowModel().rows.map((row) => {
        //                 const isSelected = row.getIsSelected();
        //                 return (
        //                     <TableRow
        //                         className={`py-0! h-15`}
        //                         key={row.id}
        //                         data-state={isSelected && "selected"}
        //                     >
        //                         {row.getVisibleCells().map((cell, index) => (
        //                             <TableCell className="text-center py-0!" key={cell.id + index}>
        //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                             </TableCell>
        //                         ))}
        //                     </TableRow>
        //                 );
        //             })
        //         ) : (
        //             <TableRow>
        //                 <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
        //                     هیچ نتیجه‌ای یافت نشد.
        //                 </TableCell>
        //             </TableRow>
        //         )}
        //     </TableBody>
        // </Table>
        <div className="flex flex-col bg-white p-4 shadow-lg rounded-lg gap-4">
            {logs.map((log, index) => (
                <div dir="ltr" className="bg-gray-100 p-4 rounded-lg" key={index}>{log}</div>
            ))}
        </div>

    )
}

export default ActivityLogs