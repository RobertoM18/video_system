import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export type User = {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
};
export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        header: 'Admin',
        accessorKey: 'is_admin',
        cell: ({ getValue }) => (getValue() ? 'true' : 'false'),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            function UserActions() {
                const [openDropwn, setOpenDropdown] = useState(false);
                const [openDialog, setOpenDialog] = useState(false);

                function openEditDialog() {
                    setOpenDropdown(false);
                    setTimeout(() => setOpenDialog(true), 0);
                }

                const { data, setData, patch, errors, reset } = useForm({
                    name: user.name,
                    email: user.email,
                    is_admin: user.is_admin,
                });

                const updateForm: FormEventHandler = (e) => {
                    e.preventDefault();
                    patch(route('admin.users.update', { userID: user.id }), {
                        onSuccess: () => {
                            reset();
                        },
                    });
                };

                return (
                    <>
                        <DropdownMenu open={openDropwn} onOpenChange={setOpenDropdown}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog()}>Editar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.delete(route('admin.users.delete', { userID: user.id }))}>
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Actualiza un usuario</DialogTitle>
                                    <DialogDescription>Actualiza los detalles del usuario {user.name}.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={updateForm}>
                                    <div className="grid gap-4">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)}></Input>
                                        <InputError message={errors.name}></InputError>
                                        <Label htmlFor="email">email</Label>
                                        <Input id="email" value={data.email} onChange={(event) => setData('email', event.target.value)}></Input>
                                        <InputError message={errors.email}></InputError>
                                        <Label htmlFor="is_admin">is_admin</Label>
                                        <Select value={data.is_admin.toString()} onValueChange={(value) => setData('is_admin', value === 'true')}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Seleccionar rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">true</SelectItem>
                                                <SelectItem value="false">false</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.is_admin}></InputError>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button type="submit" variant="default">
                                            Guardar
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </>
                );
            }

            return <UserActions />;
        },
    },
];
