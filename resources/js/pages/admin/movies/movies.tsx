import AppLayout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/movies/columns';
import { DataTable } from '@/pages/admin/movies/data-table';
import { Head } from '@inertiajs/react';

export default function Movies({
    movies,
    column,
    direction,
}: {
    movies: { data: []; current_page: string; per_page: number; links: [] }; column: string; direction: string;
}) {
    return (
        <>
            <AppLayout>
                <Head title="Administración de Peliculas"></Head>
                <div className="px-10">
                    <DataTable
                        columns={columns}
                        data={movies.data}
                        perPage={movies.per_page}
                        column={column}
                        direction={direction}
                        page={movies.current_page}
                        links={movies.links}
                    ></DataTable>
                </div>
            </AppLayout>
        </>
    );
}
