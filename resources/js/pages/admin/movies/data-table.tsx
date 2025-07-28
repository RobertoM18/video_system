import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Textarea } from '@headlessui/react';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { FormEventHandler, useCallback, useState } from 'react';
import { toast } from 'sonner';
import './movies.css';

const frameworks = [
    {
        value: '10',
        label: '10',
    },
    {
        value: '20',
        label: '20',
    },
    {
        value: '50',
        label: '50',
    },
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page?: string;
    perPage?: number;
    previousPage?: string;
    column?: string;
    direction?: string;
    nextPage?: string;
}

export function DataTable<TData, TValue>({ columns, data, page, perPage, previousPage, nextPage, column, direction }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(perPage !== undefined && perPage !== null ? String(perPage) : '10');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        initialState: {
            columnVisibility: {
                id: false,
                title: true,
                year: true,
                summary: true,
                genres: true,
                runtime: true,
                director: true,
                cast: false,
                rating: true,
            },
        },
    });

    const {
        data: formdata,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm({
        movie_poster: '',
        title: '',
        year: 0,
        summary: '',
        genres: '',
        runtime: '',
        director: '',
        cast: '',
        rating: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.movies.add'), {
            onSuccess: () => {
                toast.success('Pelicula agregada correctamente');
            },
            onFinish: () => {
                reset();
            },
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetData = useCallback(
        debounce((field, value) => setData(field, value), 30),
        [setData],
    );

    const [selectedDropdown, setSelectedDropdown] = useState('');
    const [position, setPosition] = useState('bottom');

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="flex gap-3">
                    <Input
                        placeholder="Buscar"
                        onChange={(event) => {
                            router.get(
                                route('admin.movies'),
                                {
                                    query: event.target.value,
                                    column: column,
                                    direction: direction,
                                },
                                { preserveState: true },
                            );
                        }}
                        className="max-w-sm"
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search framework..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No framework found.</CommandEmpty>
                                    <CommandGroup>
                                        {frameworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? '' : currentValue);
                                                    setOpen(false);
                                                    router.get(
                                                        route('admin.movies'),
                                                        {
                                                            perPage: parseInt(currentValue),
                                                            page: page,
                                                            column: column,
                                                            direction: direction,
                                                        },
                                                        {
                                                            preserveState: true,
                                                        },
                                                    );
                                                }}
                                            >
                                                {framework.label}
                                                <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Ordenar por <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                        {/*<DropdownMenuContent className="DropdownMenuContent">*/}
                        {/*    <DropdownMenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setSelectedDropdown('recent');*/}
                        {/*            router.get(*/}
                        {/*                route('admin.movies'),*/}
                        {/*                {*/}
                        {/*                    perPage: perPage,*/}
                        {/*                    column: 'id',*/}
                        {/*                    direction: 'desc',*/}
                        {/*                },*/}
                        {/*                { preserveState: true },*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Recientes {selectedDropdown === 'recent' && <Check className="ml-auto" />}*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setSelectedDropdown('older');*/}
                        {/*            router.get(*/}
                        {/*                route('admin.movies'),*/}
                        {/*                {*/}
                        {/*                    perPage: perPage,*/}
                        {/*                    column: 'id',*/}
                        {/*                    direction: 'asc',*/}
                        {/*                },*/}
                        {/*                { preserveState: true },*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Mas Antiguas {selectedDropdown === 'older' && <Check className="ml-auto" />}*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setSelectedDropdown('year');*/}
                        {/*            router.get(*/}
                        {/*                route('admin.movies'),*/}
                        {/*                {*/}
                        {/*                    perPage: perPage,*/}
                        {/*                    column: 'year',*/}
                        {/*                    direction: 'desc',*/}
                        {/*                },*/}
                        {/*                { preserveState: true },*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Año {selectedDropdown === 'year' && <Check className="ml-auto" />}*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setSelectedDropdown('rating');*/}
                        {/*            router.get(*/}
                        {/*                route('admin.movies'),*/}
                        {/*                {*/}
                        {/*                    perPage: perPage,*/}
                        {/*                    column: 'rating',*/}
                        {/*                    direction: 'desc',*/}
                        {/*                },*/}
                        {/*                { preserveState: true },*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Rating {selectedDropdown === 'rating' && <Check className="ml-auto" />}*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuContent>*/}
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columnas <ChevronDown />
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
                                            onCheckedChange={(value) => column.toggleVisibility(value)}
                                        >
                                            {(column.columnDef.meta as { columnName: string })?.columnName ?? column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Agregar Pelicula</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-96 min-w-[90vw] overflow-y-auto lg:min-h-[80vh] xl:min-h-[85vh] xl:min-w-[1200px]">
                            <DialogHeader>
                                <DialogTitle>Agregar Pelicula</DialogTitle>
                                <DialogDescription>Agrega una nueva pelicula.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submit}>
                                <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
                                    <div className="mx-auto flex w-64 flex-col gap-3">
                                        <img
                                            className="w-full"
                                            src={`${formdata.movie_poster ? formdata.movie_poster : 'https://placehold.co/256x400'}`}
                                            alt={formdata.title}
                                        />
                                        <Input
                                            id="poster"
                                            value={formdata.movie_poster}
                                            onChange={(event) => debouncedSetData('movie_poster', event.target.value)}
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
                                                    value={formdata.title}
                                                    onChange={(event) => debouncedSetData('title', event.target.value)}
                                                />
                                                <InputError message={errors.title} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="year">Año</Label>
                                                <Input
                                                    id="year"
                                                    type="number"
                                                    value={String(formdata.year)}
                                                    onChange={(event) => debouncedSetData('year', parseInt(event.target.value))}
                                                />
                                                <InputError message={errors.year} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="genres">Generos</Label>
                                                <Input
                                                    id="genre"
                                                    type="text"
                                                    value={formdata.genres}
                                                    onChange={(event) => debouncedSetData('genres', event.target.value)}
                                                />
                                                <InputError message={errors.genres} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="runtime">Duración</Label>
                                                <Input
                                                    id="runtime"
                                                    type="text"
                                                    value={formdata.runtime}
                                                    onChange={(event) => debouncedSetData('runtime', event.target.value)}
                                                />
                                                <InputError message={errors.runtime} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="director">Director</Label>
                                                <Input
                                                    id="director"
                                                    type="text"
                                                    value={formdata.director}
                                                    onChange={(event) => debouncedSetData('director', event.target.value)}
                                                />
                                                <InputError message={errors.director} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="cast">Elenco</Label>
                                                <Input
                                                    id="cast"
                                                    type="text"
                                                    value={formdata.cast}
                                                    onChange={(event) => debouncedSetData('cast', event.target.value)}
                                                />
                                                <InputError message={errors.cast} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="rating">Rating</Label>
                                                <Input
                                                    id="rating"
                                                    type="text"
                                                    value={formdata.rating}
                                                    onChange={(event) => debouncedSetData('rating', event.target.value)}
                                                />
                                                <InputError message={errors.rating} />
                                            </div>
                                            <div className="col-span-2 grid gap-3">
                                                <Label htmlFor="summary">Resumen</Label>
                                                <Textarea
                                                    id="summary"
                                                    rows={3}
                                                    value={formdata.summary}
                                                    onChange={(event) => debouncedSetData('summary', event.target.value)}
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
                </div>
            </div>
            <div className="rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            title={`${cell.getValue()}`}
                                            style={{ width: cell.column.getSize() }}
                                            className="truncate"
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {previousPage ? (
                    <Link href={previousPage} data={{ perPage: parseInt(value) }} preserveState>
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                )}
                {nextPage ? (
                    <Link href={nextPage} data={{ perPage: parseInt(value), column: column, direction: direction }} preserveState>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
