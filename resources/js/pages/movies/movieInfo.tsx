import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Heart } from 'lucide-react';

interface Movie {
    id: number;
    movie_poster: string;
    title: string;
    summary: string;
    cast: string;
    year: number;
    genres: string;
    runtime: string;
    director: string;
    rating: string;
    trailer: string;
}

export default function MovieInfo({ movie, isFavorite }: { movie: Movie; isFavorite: boolean }) {
    const isMobile = useIsMobile();
    return <>{isMobile ? <MovieInfoMobile movie={movie} /> : <MovieInfoDesktop movie={movie} isFavorite={isFavorite} />}</>;
}

function MovieInfoDesktop({ movie, isFavorite }: { movie: Movie; isFavorite: boolean }) {
    return (
        <>
            <AppLayout>
                <div className="flex flex-row justify-center gap-5 px-10 py-4">
                    <div className="flex gap-5">
                        <div className="relative flex flex-col gap-2">
                            <img alt={movie.title} src={movie.movie_poster} className="w-64 object-cover"></img>
                            <span>{movie.title}</span>
                            <Button
                                onClick={() => {
                                    if (isFavorite) {
                                        router.delete(route('movie.removeFavorite', { movieID: movie.id }));
                                    } else {
                                        router.post(route('movie.addToFavorites', { movieId: movie.id }));
                                    }
                                }}
                                className="absolute top-0 right-0 cursor-pointer bg-chart-2 hover:bg-red-500"
                                size="sm"
                            >
                                <Heart />
                                {isFavorite ? 'Eliminar de Favoritos' : 'Agregar a favoritos'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex w-[75vw] grow flex-col gap-6">
                        <Tabs defaultValue="info">
                            <TabsList>
                                <TabsTrigger value="info">Descripción</TabsTrigger>
                                <TabsTrigger value="trailer">Trailer</TabsTrigger>
                            </TabsList>
                            <TabsContent value="info">
                                <Card>
                                    <CardHeader>
                                        <CardContent className="grid gap-2">
                                            <h2 className="font-bold">Resumen</h2>
                                            <p>{movie.summary}</p>
                                            <h2 className="font-bold">Año</h2>
                                            <p>{movie.year}</p>
                                            <h2 className="font-bold">Géneros</h2>
                                            <p>{movie.genres}</p>
                                            <h2 className="font-bold">Elenco</h2>
                                            <p>{movie.cast}</p>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                            <TabsContent value="trailer">
                                <Card>
                                    <CardContent className={`flex items-center justify-center ${movie.trailer ? '' : 'h-72'}`}>
                                        {movie.trailer ? (
                                            <iframe
                                                width="864"
                                                height="486"
                                                src={movie.trailer}
                                                title={movie.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <span>No tenemos trailer aún</span>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

function MovieInfoMobile({ movie }: { movie: Movie }) {
    return (
        <>
            <AppLayout>
                <div className="flex flex-col gap-5 px-4 pb-4">
                    <div className="flex grow gap-5">
                        <div className="flex flex-col gap-4">
                            <img alt={movie.title} src={movie.movie_poster} className="w-64"></img>
                        </div>
                        <Button size="sm">
                            <Heart />
                            Favoritos
                        </Button>
                    </div>
                    <span>{movie.title}</span>
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <Tabs defaultValue="info">
                            <TabsList>
                                <TabsTrigger value="info">Descripción</TabsTrigger>
                                <TabsTrigger value="trailer">Trailer</TabsTrigger>
                            </TabsList>
                            <TabsContent value="info">
                                <Card>
                                    <CardHeader>
                                        <CardContent className="grid gap-2">
                                            <h2 className="font-bold">Resumen</h2>
                                            <p>{movie.summary}</p>
                                            <h2 className="font-bold">Año</h2>
                                            <p>{movie.year}</p>
                                            <h2 className="font-bold">Géneros</h2>
                                            <p>{movie.genres}</p>
                                            <h2 className="font-bold">Elenco</h2>
                                            <p>{movie.cast}</p>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                            <TabsContent value="trailer">Change your password here.</TabsContent>
                        </Tabs>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
