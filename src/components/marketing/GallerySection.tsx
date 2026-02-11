import ImageGallery from './ImageGallery';

export default function GallerySection() {
  const images = [
    {
      url: 'https://images.pexels.com/photos/672051/pexels-photo-672051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Essential oils and natural ingredients',
      caption: "Olis essencials naturals d'alta qualitat",
    },
    {
      url: 'https://images.pexels.com/photos/6560289/pexels-photo-6560289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Therapeutic massage session',
      caption: 'Tractaments personalitzats',
    },
    {
      url: 'https://images.pexels.com/photos/5793683/pexels-photo-5793683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Therapist consulting with client',
      caption: 'Atenció personalitzada i propera',
    },
    {
      url: 'https://images.pexels.com/photos/3230236/pexels-photo-3230236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Professional massage therapy',
      caption: 'Mans expertes per al teu benestar',
    },
    {
      url: 'https://images.pexels.com/photos/6560282/pexels-photo-6560282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Applying massage oil',
      caption: 'Cura i atenció al detall',
    },
    {
      url: 'https://images.pexels.com/photos/3762880/pexels-photo-3762880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Close up of massage oils',
      caption: 'Productes naturals i ecològics',
    },
  ];

  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-foreground sm:text-4xl">
            El nostre <span className="font-medium text-warning">Espai</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl font-light text-muted-foreground">
            Un refugi de pau i tranquil·litat al centre de Barcelona, dissenyat per a la teva
            desconnexió total.
          </p>
        </div>

        <ImageGallery images={images} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  );
}
