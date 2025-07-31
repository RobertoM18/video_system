import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router, useForm } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

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

const valuesAdmin = [
    {
        value: '0',
        label: 'Usuario',
    },
    {
        value: '1',
        label: 'Administrador',
    },
];

type User = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_admin: string;
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page?: string;
    perPage?: number;
    links: { url: string; label: string; active: boolean }[];
}

export function DataTable<TData, TValue>({ columns, data, page, perPage, links }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [open, setOpen] = useState(false);
    const [openAddUser, setOpenAddUser] = useState(false);
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
    });

    const {
        data: formdata,
        setData,
        post,
        processing,
        errors,
        reset
    } = useForm<Required<User>>({
        email: '',
        name: '',
        password: '',
        password_confirmation: '',
        is_admin: '0',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.add'), {
            onSuccess: () => {
                toast.success('Usuario creado exitosamente');
                reset();
                setOpenAddUser(false);
            },
            onError: () => {
                toast.error('Error al crear el usuario');
            },
        });
    };
    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4 md:flex-nowrap">
                <div className="flex gap-3">
                    <Input
                        placeholder="Buscar"
                        onChange={(event) => {
                            router.get(
                                route('admin.users'),
                                {
                                    query: event.target.value,
                                    perPage: perPage,
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
                                                        route('admin.users'),
                                                        {
                                                            perPage: parseInt(currentValue),
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
                <Dialog open={openAddUser} onOpenChange={setOpenAddUser}>
                    <DialogTrigger asChild>
                        <Button>Agregar Usuario</Button>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Agregar Usuario Nuevo</DialogTitle>
                            <DialogDescription>Agrega un nuevo usuario.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit}>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" type="text" value={formdata.name} onChange={(event) => setData('name', event.target.value)}></Input>
                                <InputError message={errors.name}></InputError>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formdata.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                ></Input>
                                <InputError message={errors.email}></InputError>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formdata.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                ></Input>
                                <InputError message={errors.password}></InputError>
                                <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={formdata.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.target.value)}
                                ></Input>
                                <InputError message={errors.password_confirmation}></InputError>
                                <Label htmlFor="role">Role</Label>
                                <Select value={formdata.is_admin} onValueChange={(value) => setData('is_admin', value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {valuesAdmin.map((index) => (
                                            <SelectItem key={index.value} value={index.value}>
                                                {index.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={processing}>
                                    Enviar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            <div className="flex items-center justify-end space-x-2 justify-self-end py-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationPrevious
                            href={links?.[0]?.url ? `${links[0].url}${links[0].url.includes('?') ? '&' : '?'}perPage=${perPage}` : '#'}
                        ></PaginationPrevious>
                        {links.length > 7 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href={links[1].url ? `${links[1].url}${links[1].url.includes('?') ? '&' : '?'}perPage=${perPage}` : '#'}
                                        isActive={links[1].active}
                                    >
                                        {links[1].label}
                                    </PaginationLink>
                                </PaginationItem>
                                {Number(page) > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}
                                {links.slice(Math.max(Number(page) - 1, 2), Math.min(Number(page) + 4, links.length - 2)).map((link, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url ? `${link.url}${link.url.includes('?') ? '&' : '?'}perPage=${perPage}` : '#'}
                                            isActive={link.active}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                {Number(page) < links.length - 4 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        href={
                                            links[links.length - 2].url
                                                ? `${links[links.length - 2].url}${links[links.length - 2].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                                : '#'
                                        }
                                        isActive={links[links.length - 2].active}
                                    >
                                        {links[links.length - 2].label}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}
                        {links.length <= 7 &&
                            links.slice(1, links.length - 1).map((link, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={`${link.url}${link.url.includes('?') ? '&' : '?'}perPage=${perPage}`}
                                        isActive={link.active}
                                    >
                                        {link.label}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        <PaginationNext
                            href={
                                links?.[links.length - 1]?.url
                                    ? `${links[links.length - 1].url}${links[links.length - 1].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                    : '#'
                            }
                        ></PaginationNext>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
