import { Card, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Movie {
    id: string;
    movie_poster: string;
    title: string;
}

export default function Favorites({ favorites }: { favorites: { id: number; movie: Movie }[] }) {
    return (
        <AppLayout>
            <Head title="Favoritos"></Head>
            <div className="mx-auto mt-5 flex flex-wrap gap-3">
                {favorites.map((favorite) => (
                    <Link
                        key={favorite.id}
                        href={route(`movie.info`, {
                            movieId: favorite.movie.id,
                            movieTitle: favorite.movie.title.toLowerCase().replace(/\s+/g, '-'),
                        })}
                    >
                        <Card
                            className="h-64 w-40 justify-end overflow-hidden bg-cover transition ease-in-out hover:-translate-y-1 hover:scale-103 xl:h-96 xl:w-60"
                            style={{ backgroundImage: `url(${favorite.movie.movie_poster})` }}
                        >
                            <CardFooter className="text-end text-sm text-foreground">{favorite.movie.title}</CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
