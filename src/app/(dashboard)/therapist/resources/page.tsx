import { getResources } from '@/server/resources/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Activity, Layers, Share2, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';

export default async function TherapistResourcesPage() {
  const resources = await getResources();

  // If no resources found remotely, supply an array of nicely structured mock ones for UI display.
  const displayResources = resources.length > 0 ? resources : fallbackResources;

  return (
    <div className="animate-in fade-in zoom-in container mx-auto max-w-6xl space-y-8 p-6 duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'meditation':
        return <Activity className="h-4 w-4" />;
      case 'protocol':
      case 'kinesiology':
        return <Layers className="h-4 w-4" />;
      case 'article':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group border-border/50 relative flex h-full flex-col overflow-hidden transition-all duration-300">
      {resource.imageUrl && (
        <div className="bg-muted h-48 w-full overflow-hidden">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <Badge variant={resource.isPremium ? 'default' : 'secondary'} className="capitalize">
            {getIcon(resource.category)}
            <span className="ml-1.5">{resource.category}</span>
          </Badge>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary h-8 w-8"
              title="Bookmark"
            >
              <BookmarkPlus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary h-8 w-8"
              title="Share with Client"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-xl leading-tight">{resource.title}</CardTitle>
        <CardDescription className="mt-2 line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-1 flex-col justify-end pt-4">
        <Link
          href={`/therapist/resources/${resource.id}`}
          className="text-primary inline-flex items-center text-sm font-medium tracking-wider uppercase transition-all group-hover:gap-2 hover:underline"
        >
          Open Resource <span className="opacity-0 group-hover:opacity-100">&rarr;</span>
        </Link>
      </CardContent>
    </Card>
  );
}

// Fallback resources specifically including the extracted protocols
const fallbackResources = [
  {
    id: 'kine-1',
    title: 'Kinesiología Global y Emocional',
    description:
      'Protocolo completo diseñado por Marta Román i Cabané y Francesc Marieges. Incluye bucle, pre-test, autorizaciones y correcciones multidimensionales.',
    content: '',
    category: 'kinesiology',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'kine-2',
    title: 'Navegador Kinesiología Emocional',
    description:
      'Tablas, cuadros de apoyo y herramientas (substituto/intermediario, bucle básico) para sesiones de kinesiología emocional.',
    content: '',
    category: 'kinesiology',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'kine-3',
    title: 'Protocolo Kinebioquímica v2.9.2',
    description:
      'Evaluación de toxicidad, cándidas, metales pesados, alergias y nutrición celular mediante test muscular.',
    content: '',
    category: 'protocol',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'psych-1',
    title: 'Systemic Constellations Guide',
    description:
      'A structural guide indicating steps and AI prompts for guiding patient roles safely through their system map.',
    content: '',
    category: 'article',
    isPremium: false,
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop',
  },
];
