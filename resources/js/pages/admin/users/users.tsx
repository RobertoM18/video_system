import AppLayout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/users/columns';
import { DataTable } from '@/pages/admin/users/data-table';
import { Head } from '@inertiajs/react';

export default function AdminUsers({
    users,
}: {
    users: { data: []; current_page: string; per_page: number; links: [] };
}) {
    return (
        <>
            <AppLayout>
                <Head title="Administración de Usuarios"></Head>
                <div className="px-10">
                    <DataTable
                        columns={columns}
                        data={users.data}
                        links={users.links}
                        page={users.current_page}
                        perPage={users.per_page}
                    ></DataTable>
                </div>
            </AppLayout>
        </>
    );
}
