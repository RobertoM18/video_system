import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

export type Movie = {
    id: string;
    movie_poster: string;
    title: string;
    year: number;
    summary: string;
    genres: string;
    runtime: string;
    director: string;
    cast: string;
    rating: string;
    trailer: string;
};
type MovieForm = {
    id: number;
    movie_poster: string;
    title: string;
    year: number;
    summary: string;
    genres: string;
    runtime: string;
    director: string;
    cast: string;
    rating: string;
    trailer: string;
};
export const columns: ColumnDef<Movie>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button className="w-fit justify-start" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Titulo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        meta:{
            columnName: 'Titulo',
        },
    },
    {
        accessorKey: 'year',
        header: ({ column }) => {
            return (
                <Button className="w-fit justify-start" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Año
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            );
        },
        maxSize: 100,
        size: 80,
        meta:{
            columnName: 'Año',
        },
    },
    {
        header: 'Resumen',
        accessorKey: 'summary',
        meta:{
            columnName: 'Resumen',
        },
    },
    {
        header: 'Géneros',
        accessorKey: 'genres',
        meta:{
            columnName: 'Generos',
        },
    },
    {
        header: 'Duración',
        accessorKey: 'runtime',
        size: 80,
        maxSize: 100,
        meta:{
            columnName: 'Duración',
        },
    },
    {
        header: 'Director',
        accessorKey: 'director',
        meta:{
            columnName: 'Director',
        },
    },
    {
        header: 'Reparto',
        accessorKey: 'cast',
        meta:{
            columnName: 'Reparto',
        },
    },
    {
        header: 'Rating',
        accessorKey: 'rating',
        maxSize: 100,
        size: 50,
        meta:{
            columnName: 'Rating',
        },
    },
    {
        id: 'actions',
        maxSize: 100,
        size: 50,
        meta:{
            columnName: 'Acciones',
        },
        cell: ({ row }) => {
            const movie = row.original;

            function ActionsCell() {
                const [dialogOpen, setDialogOpen] = useState(false);
                const [dropdownOpen, setDropdownOpen] = useState(false);
                const handleOpenDialog = () => {
                    setDropdownOpen(false);
                    setTimeout(() => setDialogOpen(true), 0);
                };

                const { data, setData, put, processing, errors, reset } = useForm<Required<MovieForm>>({
                    id: parseInt(movie.id),
                    movie_poster: movie.movie_poster,
                    title: movie.title,
                    year: movie.year,
                    summary: movie.summary,
                    genres: movie.genres,
                    runtime: movie.runtime ?? '',
                    director: movie.director ?? '',
                    cast: movie.cast,
                    rating: movie.rating ?? '',
                    trailer: movie.trailer ?? '',
                });
                const submit: FormEventHandler = (e) => {
                    e.preventDefault();
                    put(route('admin.movies.update'), {
                        onSuccess: () => {
                            toast.success('Película actualizada correctamente');
                        },
                        onError: () => {
                            toast.error('Error al actualizar la película');
                        },
                        onFinish: () => {
                            reset();
                        },
                        preserveState: true,
                    });
                };

                return (
                    <>
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleOpenDialog} itemID={movie.id}>
                                    Actualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    itemID={movie.id}
                                    onClick={() =>
                                        router.delete(route('admin.movies.delete', { movieID: parseInt(movie.id) }), {
                                            preserveUrl: true,
                                            preserveState: true,
                                            onSuccess: () => {
                                                toast.success('Película eliminada correctamente');
                                            },
                                        })
                                    }
                                >
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent className="w-[80vw] xl:max-w-[1200px] max-h-[90vh] lg:min-w-[900px] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{movie.title}</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>Actualiza los datos de la película.</DialogDescription>
                                <form onSubmit={submit}>
                                    <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
                                        <div className="flex flex-col gap-3 w-full md:w-64 flex-shrink-0">
                                            <img className="w-full" src={`${data.movie_poster ? data.movie_poster : 'https://placehold.co/256x400'}`} alt={data.title} />
                                            <Input
                                                id="poster"
                                                value={data.movie_poster}
                                                onChange={(event) => setData('movie_poster', event.target.value)}
                                            />
                                            <InputError message={errors.movie_poster} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="title">Titulo</Label>
                                                    <Input
                                                        id="title"
                                                        type="text"
                                                        value={data.title}
                                                        onChange={(event) => setData('title', event.target.value)}
                                                    />
                                                    <InputError message={errors.title} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="year">Año</Label>
                                                    <Input
                                                        id="year"
                                                        type="number"
                                                        value={String(data.year)}
                                                        onChange={(event) => setData('year', parseInt(event.target.value))}
                                                    />
                                                    <InputError message={errors.year} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="genres">Generos</Label>
                                                    <Input
                                                        id="genre"
                                                        type="text"
                                                        value={data.genres}
                                                        onChange={(event) => setData('genres', event.target.value)}
                                                    />
                                                    <InputError message={errors.genres} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="runtime">Duración</Label>
                                                    <Input
                                                        id="runtime"
                                                        type="text"
                                                        value={data.runtime}
                                                        onChange={(event) => setData('runtime', event.target.value)}
                                                    />
                                                    <InputError message={errors.runtime} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="director">Director</Label>
                                                    <Input
                                                        id="director"
                                                        type="text"
                                                        value={data.director}
                                                        onChange={(event) => setData('director', event.target.value)}
                                                    />
                                                    <InputError message={errors.director} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="cast">Elenco</Label>
                                                    <Input
                                                        id="cast"
                                                        type="text"
                                                        value={data.cast}
                                                        onChange={(event) => setData('cast', event.target.value)}
                                                    />
                                                    <InputError message={errors.cast} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="rating">Rating</Label>
                                                    <Input
                                                        id="rating"
                                                        type="text"
                                                        value={data.rating}
                                                        onChange={(event) => setData('rating', event.target.value)}
                                                    />
                                                    <InputError message={errors.rating} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="trailer">Trailer</Label>
                                                    <Input
                                                        id="trailer"
                                                        type="text"
                                                        value={data.trailer}
                                                        onChange={(event) => setData('trailer', event.target.value)}
                                                    />
                                                    <InputError message={errors.rating} />
                                                </div>
                                                <div className="col-span-2 grid gap-3">
                                                    <Label htmlFor="summary">Resumen</Label>
                                                    <Textarea
                                                        id="summary"
                                                        rows={3}
                                                        value={data.summary}
                                                        onChange={(event) => setData('summary', event.target.value)}
                                                    />
                                                    <InputError message={errors.summary} />
                                                </div>
                                                <Button type="submit" disabled={processing}>
                                                    Enviar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </>
                );
            }

            return <ActionsCell></ActionsCell>;
        },
    },
];
