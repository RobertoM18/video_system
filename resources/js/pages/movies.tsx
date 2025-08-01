import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Movie {
    id: number;
    movie_poster: string;
    title: string;
    summary: string;
    cast: string;
}

const genres = [
    {
        value: 'Comedia',
        label: 'Comedia',
    },
    {
        value: 'Acción',
        label: 'Acción',
    },
    {
        value: 'Terror',
        label: 'Terror',
    },
    {
        value: 'Aventura',
        label: 'Aventura',
    },
    {
        value: 'Fantasía',
        label: 'Fantasía',
    },
    {
        value: 'Familiar',
        label: 'Familiar',
    },
];

function ItemsPerPage({
    perPage,
    setPerPage,
    search,
    genre,
}: {
    perPage: string;
    search: string;
    genre: string;
    setPerPage: (value: number) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-fit justify-between">
                    {perPage}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[100px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {['20', '50', '75', '100'].map((value) => (
                                <CommandItem
                                    key={value}
                                    value={value}
                                    onSelect={() => {
                                        setPerPage(Number(value));
                                        setOpen(false);
                                        router.visit(route('movies.search'), {
                                            method: 'get',
                                            data: {
                                                title: search,
                                                genre: genre,
                                                perPage: parseInt(value),
                                            },
                                            preserveState: true,
                                        });
                                    }}
                                >
                                    {value}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function Movies({
    movies,
    perPage: perPageProp,
}: {
    movies: {
        links: {url: string; label: string; active: boolean}[];
        current_page: number;
        last_page: number;
        perPage: number;
        data: Movie[];
    };
    perPage: number;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(perPageProp || 20);
    return (
        <>
            <AppLayout>
                <Head title="Test Page" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className={`mx-auto flex flex-wrap items-center justify-start gap-3 sm:flex-nowrap`}>
                        <Label htmlFor="perPage">Por pagina</Label>
                        <ItemsPerPage
                            perPage={String(perPage)}
                            setPerPage={(value) => setPerPage(Number(value))}
                            search={search}
                            genre={value}
                        ></ItemsPerPage>
                        <div className="flex items-center gap-3">
                            <Label htmlFor="filter">Filtro</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between xl:w-full">
                                        {value ? genres.find((framework) => framework.value === value)?.label : 'Selecciona un genero'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Busca un genero..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No se encontro el genero</CommandEmpty>
                                            <CommandGroup>
                                                {genres.map((genre) => (
                                                    <CommandItem
                                                        key={genre.value}
                                                        value={genre.value}
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue === value ? '' : currentValue);
                                                            setOpen(false);
                                                            router.get(
                                                                route('movies.search'),
                                                                {
                                                                    genre: value === currentValue ? '' : currentValue,
                                                                    title: search,
                                                                    perPage,
                                                                },
                                                                {
                                                                    preserveState: true,
                                                                    replace: true,
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        {genre.label}
                                                        <Check className={cn('ml-auto', value === genre.value ? 'opacity-100' : 'opacity-0')} />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-3">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                type="text"
                                id="search"
                                placeholder="Buscar"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        router.get(
                                            route('movies.search'),
                                            { title: search, genre: value },
                                            {
                                                preserveState: true,
                                                replace: true,
                                            },
                                        );
                                    }
                                }}
                            ></Input>
                        </div>
                    </div>
                    <div className="mx-auto flex flex-col gap-4">
                        <div className="flex w-fit self-end">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationPrevious
                                        href={
                                            movies.links?.[0]?.url
                                                ? `${movies.links[0].url}${movies.links[0].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                                : '#'
                                        }
                                    ></PaginationPrevious>
                                    {movies.links.length > 7 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink
                                                    href={
                                                        movies.links[1].url
                                                            ? `${movies.links[1].url}${movies.links[1].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                                            : '#'
                                                    }
                                                    isActive={movies.links[1].active}
                                                >
                                                    {movies.links[1].label}
                                                </PaginationLink>
                                            </PaginationItem>
                                            {Number(movies.current_page) > 3 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            {movies.links
                                                .slice(Math.max(Number(movies.current_page) - 1, 2), Math.min(Number(movies.current_page) + 4, movies.links.length - 2))
                                                .map((link, index) => (
                                                    <PaginationItem key={index}>
                                                        <PaginationLink
                                                            href={
                                                                link.url ? `${link.url}${link.url.includes('?') ? '&' : '?'}perPage=${perPage}` : '#'
                                                            }
                                                            isActive={link.active}
                                                        >
                                                            {link.label}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                            {Number(movies.current_page) < movies.links.length - 4 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    href={
                                                        movies.links[movies.links.length - 2].url
                                                            ? `${movies.links[movies.links.length - 2].url}${movies.links[movies.links.length - 2].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                                            : '#'
                                                    }
                                                    isActive={movies.links[movies.links.length - 2].active}
                                                >
                                                    {movies.links[movies.links.length - 2].label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}
                                    {movies.links.length <= 7 &&
                                        movies.links.slice(1, movies.links.length - 1).map((link, index) => (
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
                                            movies.links?.[movies.links.length - 1]?.url
                                                ? `${movies.links[movies.links.length - 1].url}${movies.links[movies.links.length - 1].url.includes('?') ? '&' : '?'}perPage=${perPage}`
                                                : '#'
                                        }
                                    ></PaginationNext>
                                </PaginationContent>
                            </Pagination>
                        </div>
                        <div className="my-5 flex flex-1 cursor-pointer flex-wrap justify-center gap-4 overflow-hidden">
                            {movies.data.map(
                                (
                                    movie: {
                                        id: number;
                                        movie_poster: string;
                                        title: string;
                                        summary: string;
                                        cast: string;
                                    },
                                    index: number,
                                ) => (
                                    <Link
                                        key={index}
                                        href={route(`movie.info`, {
                                            movieId: movie.id,
                                            movieTitle: movie.title.toLowerCase().replace(/\s+/g, '-'),
                                        })}
                                    >
                                        <Card
                                            className="h-64 w-40 justify-end overflow-hidden bg-cover transition ease-in-out hover:-translate-y-1 hover:scale-103 xl:h-96 xl:w-60"
                                            style={{ backgroundImage: `url(${movie.movie_poster})` }}
                                        >
                                            <CardFooter className="text-end text-sm text-foreground">{movie.title}</CardFooter>
                                        </Card>
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
