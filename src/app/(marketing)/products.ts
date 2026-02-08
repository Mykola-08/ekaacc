export type LocalizedString = string | { en: string; es: string; ru: string; ca: string };

export type Product = {
  id: string;
  slug?: string;
  name: LocalizedString;
  category: string;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  longDescription?: LocalizedString;
  features?: LocalizedString[];
  benefits?: LocalizedString[];
  ingredients?: LocalizedString[];
  usage?: LocalizedString;
  price?: string;
  image?: string;
};

export function getLocalized(content: LocalizedString | undefined, lang: string): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  const localized = content as Record<string, string>;
  return localized[lang] || localized['en'] || '';
}

export const products: Product[] = [
  // --- XBi-A SERIES ---
  {
    id: 'Vitamin-D3-XBi-A',
    slug: 'vitamin-d3-xbi-a',
    name: {
      en: 'Vitamin D3 + XBi-A',
      es: 'Vitamina D3 + XBi-A',
      ru: 'Витамин D3 + XBi-A',
      ca: 'Vitamina D3 + XBi-A',
    },
    category: 'XBi-A Series',
    description: {
      en: 'Vegan sun vitamin with bioavailability booster. 2000 IU + XBi-A.',
      es: 'Vitamina solar vegana con potenciador de biodisponibilidad. 2000 UI + XBi-A.',
      ru: 'Веганский солнечный витамин с усилителем биодоступности. 2000 МЕ + XBi-A.',
      ca: 'Vitamina solar vegana amb potenciador de biodisponibilitat. 2000 UI + XBi-A.',
    },
    longDescription: {
      en: 'Vitamin D3 + XBi-A uses microencapsulated cholecalciferol from Reindeer Lichen (100% vegan) enhanced with the patented XBi-A® complex. This combination increases absorption by up to 60%. Essential for immune health, bone density, and hormonal balance.',
      es: 'Vitamin D3 + XBi-A utiliza colecalciferol microencapsulado de Liquen de Reno (100% vegano) mejorado con el complejo patentado XBi-A®. Esta combinación aumenta la absorción hasta en un 60%. Esencial para la salud inmunológica, la densidad ósea y el equilibrio hormonal.',
      ru: 'Vitamin D3 + XBi-A использует микрокапсулированный холекальциферол из оленьего мха (100% веганский), усиленный запатентованным комплексом XBi-A®. Эта комбинация увеличивает усвоение до 60%. Необходим для иммунитета, плотности костей и гормонального баланса.',
      ca: "Vitamin D3 + XBi-A utilitza colecalciferol microencapsulat de Liquen de Ren (100% vegà) millorat amb el complex patentat XBi-A®. Aquesta combinació augmenta l'absorció fins a un 60%. Essencial per a la salut immunitària, la densitat òssia i l'equilibri hormonal.",
    },
    benefits: [
      {
        en: 'Supports normal immune system function.',
        es: 'Apoya la función normal del sistema inmunológico.',
        ru: 'Поддерживает нормальную функцию иммунной системы.',
        ca: 'Suporta la funció normal del sistema immunitari.',
      },
      {
        en: 'Maintains normal bones and muscle function.',
        es: 'Mantiene los huesos y la función muscular normales.',
        ru: 'Поддерживает нормальное состояние костей и мышц.',
        ca: 'Manté els ossos i la funció muscular normals.',
      },
      {
        en: '100% Vegan (Lichen source).',
        es: '100% Vegano (fuente de liquen).',
        ru: '100% Веганский (из лишайника).',
        ca: '100% Vegà (font de liquen).',
      },
      {
        en: '60% higher absorption due to XBi-A.',
        es: '60% mayor absorción gracias a XBi-A.',
        ru: 'Усвоение выше на 60% благодаря XBi-A.',
        ca: '60% major absorció gràcies a XBi-A.',
      },
    ],
    ingredients: [
      {
        en: 'Vitamin D3 (Cholecalciferol from Reindeer Lichen) - 2000 IU',
        es: 'Vitamina D3 (Colecalciferol de Liquen de Reno) - 2000 UI',
        ru: 'Витамин D3 (Холекальциферол из Оленьего мха) - 2000 МЕ',
        ca: 'Vitamina D3 (Colecalciferol de Liquen de Ren) - 2000 UI',
      },
      {
        en: 'MCT Oil (Medium Chain Triglycerides)',
        es: 'Aceite MCT (Triglicéridos de Cadena Media)',
        ru: 'Масло МСТ (Среднецепочечные триглицериды)',
        ca: 'Oli MCT (Triglicèrids de Cadena Mitjana)',
      },
      {
        en: 'XBi-A Complex (Ginger, Black Pepper, Amla, Shilajit)',
        es: 'Complejo XBi-A (Jengibre, Pimienta Negra, Amla, Shilajit)',
        ru: 'Комплекс XBi-A (Имбирь, Черный перец, Амла, Мумие)',
        ca: 'Complex XBi-A (Gingebre, Pebre Negre, Amla, Shilajit)',
      },
    ],
    usage: {
      en: '1 capsule daily with a fatty meal.',
      es: '1 cápsula al día con una comida grasa.',
      ru: '1 капсула в день во время еды (желательно с жирами).',
      ca: '1 càpsula al dia amb un àpat gras.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/VitaminD3_1.72cbzz0zfx80c69v1cwvdl.jpg',
  },
  {
    id: 'Octomagnesium-XBi-A',
    slug: 'octomagnesium-xbi-a',
    name: {
      en: 'OctoMagnesium + XBi-A',
      es: 'OctoMagnesio + XBi-A',
      ru: 'ОктоМагний + XBi-A',
      ca: 'OctoMagnesi + XBi-A',
    },
    category: 'XBi-A Series',
    description: {
      en: "World's first 8-form magnesium complex for total relaxation.",
      es: 'El primer complejo de magnesio de 8 formas del mundo para una relajación total.',
      ru: 'Первый в мире комплекс из 8 форм магния для полной релаксации.',
      ca: 'El primer complex de magnesi de 8 formes del món per a una relaxació total.',
    },
    longDescription: {
      en: 'OctoMagnesium is a revolutionary formula combining 8 distinct forms of magnesium to target every system in the body. By using specialized chelates like Bisglycinate (sleep), Malate (energy), and Taurate (heart), it ensures maximum absorption without the digestive issues of standard magnesium.',
      es: 'OctoMagnesio es una fórmula revolucionaria que combina 8 formas distintas de magnesio para enfocarse en cada sistema del cuerpo. Al usar quelatos especializados como Bisglicinato (sueño), Malato (energía) y Taurato (corazón), asegura la máxima absorción sin los problemas digestivos del magnesio estándar.',
      ru: 'ОктоМагний — это революционная формула, объединяющая 8 различных форм магния для воздействия на каждую систему организма. Используя специализированные хелаты, такие как бисглицинат (сон), малат (энергия) и таурат (сердце), он обеспечивает максимальное усвоение без проблем с пищеварением, характерных для обычного магния.',
      ca: 'OctoMagnesi és una fórmula revolucionària que combina 8 formes distintes de magnesi per enfocar-se en cada sistema del cos. En utilitzar quelats especialitzats com Bisglicinat (son), Malat (energia) i Taurat (cor), assegura la màxima absorció sense els problemes digestius del magnesi estàndard.',
    },
    benefits: [
      {
        en: 'Magnesium Bisglycinate: Anxiety relief & sleep support.',
        es: 'Bisglicinato de Magnesio: Alivio de ansiedad y apoyo al sueño.',
        ru: 'Бисглицинат магния: Снятие тревоги и поддержка сна.',
        ca: "Bisglicinat de Magnesi: Alleugeriment de l'ansietat i suport al son.",
      },
      {
        en: 'Magnesium Malate: Energy enhancement (Krebs cycle).',
        es: 'Malato de Magnesio: Aumento de energía (ciclo de Krebs).',
        ru: 'Малат магния: Повышение энергии (цикл Кребса).',
        ca: "Malat de Magnesi: Augment d'energia (cicle de Krebs).",
      },
      {
        en: 'Magnesium Taurate: Cardiovascular health & rhythm.',
        es: 'Taurato de Magnesio: Salud cardiovascular y ritmo.',
        ru: 'Таурат магния: Здоровье сердца и ритм.',
        ca: 'Taurat de Magnesi: Salut cardiovascular i ritme.',
      },
      {
        en: 'Magnesium Citrate: Digestion & rapid absorption.',
        es: 'Citrato de Magnesio: Digestión y absorción rápida.',
        ru: 'Цитрат магния: Пищеварение и быстрое усвоение.',
        ca: 'Citrat de Magnesi: Digestió i absorció ràpida.',
      },
    ],
    ingredients: [
      {
        en: '1. Magnesium Bisglycinate (Chelate)',
        es: '1. Bisglicinato de Magnesio (Quelato)',
        ru: '1. Бисглицинат магния (Хелат)',
        ca: '1. Bisglicinat de Magnesi (Quelat)',
      },
      {
        en: '2. Magnesium Citrate (Organic Salt)',
        es: '2. Citrato de Magnesio (Sal Orgánica)',
        ru: '2. Цитрат магния (Органическая соль)',
        ca: '2. Citrat de Magnesi (Sal Orgànica)',
      },
      {
        en: '3. Magnesium Malate (Acid Salt)',
        es: '3. Malato de Magnesio (Sal Ácida)',
        ru: '3. Малат магния (Соль кислоты)',
        ca: '3. Malat de Magnesi (Sal Àcida)',
      },
      {
        en: '4. Magnesium Taurate (Amino Acid Chelate)',
        es: '4. Taurato de Magnesio (Quelato aminoácido)',
        ru: '4. Таурат магния (Аминокислотный хелат)',
        ca: '4. Taurat de Magnesi (Quelat aminoàcid)',
      },
      {
        en: '5. Magnesium Acetate',
        es: '5. Acetato de Magnesio',
        ru: '5. Ацетат магния',
        ca: '5. Acetat de Magnesi',
      },
      {
        en: '6. Magnesium Pidolate',
        es: '6. Pidolato de Magnesio',
        ru: '6. Пидолат магния',
        ca: '6. Pidolat de Magnesi',
      },
      {
        en: '7. Magnesium Orotate',
        es: '7. Orotato de Magnesio',
        ru: '7. Оротат магния',
        ca: '7. Orotat de Magnesi',
      },
      {
        en: '8. Magnesium Salicylate',
        es: '8. Salicilato de Magnesio',
        ru: '8. Салицилат магния',
        ca: '8. Salicilat de Magnesi',
      },
      {
        en: 'Vitamin B6 (P5P Active Form)',
        es: 'Vitamina B6 (Forma Activa P5P)',
        ru: 'Витамин B6 (Активная форма P5P)',
        ca: 'Vitamina B6 (Forma Activa P5P)',
      },
    ],
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/OctoMagnesium_1.lgj8791u36o04wc8kc4ock.jpg',
  },
  {
    id: '3D-Matrix',
    slug: '3d-matrix',
    name: {
      en: '3D-Matrix + XBi-A',
      es: '3D-Matrix + XBi-A',
      ru: '3D-Matrix + XBi-A',
      ca: '3D-Matrix + XBi-A',
    },
    category: 'Cell Elixir',
    description: {
      en: 'Triple-action connective tissue builder: Joints, Skin, and Vessels.',
      es: 'Constructor de tejido conectivo de triple acción: Articulaciones, Piel y Vasos.',
      ru: 'Тройное действие на соединительную ткань: Суставы, Кожа и Сосуды.',
      ca: 'Constructor de teixit connectiu de triple acció: Articulacions, Pell i Vasos.',
    },
    longDescription: {
      en: "3D-Matrix is a unique biological constructor providing the structural blocks for the body's connective tissues. It works in three dimensions: strengthening joints (Chondroitin/Glucosamine), rejuvenating skin (Collagen/Hyaluronic Acid), and fortifying blood vessels (Bioflavonoids/Vitamin C).",
      es: '3D-Matrix es un constructor biológico único que proporciona los bloques estructurales para los tejidos conectivos del cuerpo. Funciona en tres dimensiones: fortalecimiento de articulaciones (Condroitina/Glucosamina), rejuvenecimiento de la piel (Colágeno/Ácido Hialurónico) y fortalecimiento de vasos sanguíneos (Bioflavonoides/Vitamina C).',
      ru: '3D-Matrix — это уникальный биоконструктор, обеспечивающий структурные блоки для соединительной ткани организма. Он работает в трех измерениях: укрепление суставов (Хондроитин/Глюкозамин), омоложение кожи (Коллаген/Гиалуроновая кислота) и укрепление сосудов (Биофлавоноиды/Витамин C).',
      ca: "3D-Matrix és un constructor biològic únic que proporciona els blocs estructurals per als teixits connectius del cos. Funciona en tres dimensions: enfortiment d'articulacions (Condroitina/Glucosamina), rejoveniment de la pell (Col·lagen/Àcid Hialurònic) i enfortiment de vasos (Bioflavonoides/Vitamina C).",
    },
    benefits: [
      {
        en: 'Osteo Complex: Strengthens bones and joints.',
        es: 'Complejo Osteo: Fortalece huesos y articulaciones.',
        ru: 'Остео Комплекс: Укрепляет кости и суставы.',
        ca: 'Complex Osteo: Enforteix ossos i articulacions.',
      },
      {
        en: 'Dermal Complex: Increases skin elasticity.',
        es: 'Complejo Dérmico: Aumenta la elasticidad de la piel.',
        ru: 'Дермал Комплекс: Повышает эластичность кожи.',
        ca: "Complex Dèrmic: Augmenta l'elasticitat de la pell.",
      },
      {
        en: 'Cardio Complex: Fortifies blood vessel walls.',
        es: 'Complejo Cardio: Fortalece las paredes de los vasos sanguíneos.',
        ru: 'Кардио Комплекс: Укрепляет стенки сосудов.',
        ca: 'Complex Cardio: Enforteix les parets dels vasos sanguinis.',
      },
    ],
    ingredients: [
      {
        en: 'Glucosamine Sulfate & Chondroitin Sulfate',
        es: 'Sulfato de Glucosamina y Sulfato de Condroitina',
        ru: 'Глюкозамин сульфат и Хондроитин сульфат',
        ca: 'Sulfat de Glucosamina i Sulfat de Condroitina',
      },
      {
        en: 'Calcium Citrate & Hydroxyapatite',
        es: 'Citrato de Calcio e Hidroxiapatita',
        ru: 'Цитрат кальция и Гидроксиапатит',
        ca: 'Citrat de Calci i Hidroxiapatita',
      },
      {
        en: 'Resveratrol & Dihydroquercetin',
        es: 'Resveratrol y Dihidroquercetina',
        ru: 'Ресвератрол и Дигидрокверцетин',
        ca: 'Resveratrol i Dihidroquercetina',
      },
      {
        en: 'Vitamin C & Hesperidin',
        es: 'Vitamina C y Hesperidina',
        ru: 'Витамин C и Гесперидин',
        ca: 'Vitamina C i Hesperidina',
      },
      {
        en: 'Ginkgo Biloba Extract',
        es: 'Extracto de Ginkgo Biloba',
        ru: 'Экстракт Гинкго Билоба',
        ca: 'Extracte de Ginkgo Biloba',
      },
    ],
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/3DMatrix_1.j72oivd3g9kk048ocww0kc.jpg',
  },
  {
    id: 'FungoMax-XBi-A',
    slug: 'fungomax-xbi-a',
    name: {
      en: 'FungoMax + XBi-A',
      es: 'FungoMax + XBi-A',
      ru: 'ФунгоМакс + XBi-A',
      ca: 'FungoMax + XBi-A',
    },
    category: 'XBi-A Series',
    description: {
      en: 'The power of 6 medicinal mushrooms for ultimate immune defense.',
      es: 'El poder de 6 hongos medicinales para la defensa inmunológica definitiva.',
      ru: 'Сила 6 целебных грибов для максимальной иммунной защиты.',
      ca: 'El poder de 6 bolets medicinals per a la defensa immunitària definitiva.',
    },
    longDescription: {
      en: "FungoMax combines the ancient wisdom of medicinal mushrooms with modern bioavailability technology. Featuring high-potency extracts of Reishi, Chaga, Cordyceps, Lion's Mane, Maitake, and Agaricus, it is designed to modulate the immune system, boost energy, and protect cellular health.",
      es: 'FungoMax combina la sabiduría antigua de los hongos medicinales con la tecnología moderna de biodisponibilidad. Con extractos de alta potencia de Reishi, Chaga, Cordyceps, Melena de León, Maitake y Agaricus, está diseñado para modular el sistema inmunológico, aumentar la energía y proteger la salud celular.',
      ru: 'ФункгоМакс объединяет древнюю мудрость целебных грибов с современными технологиями. Содержа экстракты высокой активности Рейши, Чаги, Кордицепса, Ежевика гребенчатого, Мейтаке и Агарика, он создан для модуляции иммунной системы, повышения энергии и защиты здоровья клеток.',
      ca: "FungoMax combina la saviesa antiga dels bolets medicinals amb la tecnologia moderna de biodisponibilitat. Amb extractes d'alta potència de Reishi, Chaga, Cordyceps, Cabellera de Lleó, Maitake i Agaricus, està dissenyat per modular el sistema immunitari, augmentar l'energia i protegir la salut cel·lular.",
    },
    ingredients: [
      {
        en: 'Reishi (Ganoderma lucidum)',
        es: 'Reishi (Ganoderma lucidum)',
        ru: 'Рейши (Ganoderma lucidum)',
        ca: 'Reishi (Ganoderma lucidum)',
      },
      {
        en: 'Chaga (Inonotus obliquus)',
        es: 'Chaga (Inonotus obliquus)',
        ru: 'Чага (Inonotus obliquus)',
        ca: 'Chaga (Inonotus obliquus)',
      },
      {
        en: 'Cordyceps (Cordyceps sinensis)',
        es: 'Cordyceps (Cordyceps sinensis)',
        ru: 'Кордицепс (Cordyceps sinensis)',
        ca: 'Cordyceps (Cordyceps sinensis)',
      },
      {
        en: "Lion's Mane (Hericium erinaceus)",
        es: 'Melena de León (Hericium erinaceus)',
        ru: 'Ежевик гребенчатый (Hericium erinaceus)',
        ca: 'Cabellera de Lleó (Hericium erinaceus)',
      },
      {
        en: 'Maitake (Grifola frondosa)',
        es: 'Maitake (Grifola frondosa)',
        ru: 'Мейтаке (Grifola frondosa)',
        ca: 'Maitake (Grifola frondosa)',
      },
      {
        en: 'Agaricus (Agaricus blazei)',
        es: 'Agaricus (Agaricus blazei)',
        ru: 'Агарик (Agaricus blazei)',
        ca: 'Agaricus (Agaricus blazei)',
      },
    ],
    benefits: [
      {
        en: 'Immune Modulation: "Trains" immune cells.',
        es: 'Modulación inmunológica: "Entrena" las células inmunes.',
        ru: 'Иммуномодуляция: "Тренирует" иммунные клетки.',
        ca: 'Modulació immunitària: "Entrena" les cèl·lules immunes.',
      },
      {
        en: 'Adaptogenic: Helps body resist stress.',
        es: 'Adaptogénico: Ayuda al cuerpo a resistir el estrés.',
        ru: 'Адаптоген: Помогает организму противостоять стрессу.',
        ca: "Adaptogènic: Ajuda el cos a resistir l'estrès.",
      },
      {
        en: 'Antioxidant: Neutralizes free radicals.',
        es: 'Antioxidante: Neutraliza radicales libres.',
        ru: 'Антиоксидант: Нейтрализует свободные радикалы.',
        ca: 'Antioxidant: Neutralitza radicals lliures.',
      },
    ],
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/FungoMax_1.m7879r29h3koooogcg0wc4.jpg',
  },
  {
    id: 'FerBoost-XBi-A',
    slug: 'ferboost-xbi-a',
    name: {
      en: 'FerBoost + XBi-A',
      es: 'FerBoost + XBi-A',
      ru: 'ФерБуст + XBi-A',
      ca: 'FerBoost + XBi-A',
    },
    category: 'XBi-A Series',
    description: {
      en: '4-Source smart iron complex for anemia and energy.',
      es: 'Complejo de hierro inteligente de 4 fuentes para anemia y energía.',
      ru: 'Умный комплекс железа из 4 источников от анемии и для энергии.',
      ca: 'Complex de ferro intel·ligent de 4 fonts per a anèmia i energia.',
    },
    longDescription: {
      en: 'FerBoost solves the problem of iron malabsorption and side effects. It uses 4 highly bioavailable forms of iron (Bisglycinate, Fe-Liposome, Fumarate, Chelate) combined with absorption cofactors like Vitamin C, Folate, and B12. Gentle on the stomach, tough on anemia.',
      es: 'FerBoost resuelve el problema de la mala absorción de hierro y efectos secundarios. Utiliza 4 formas de hierro altamente biodisponibles (Bisglicinato, Fe-Liposoma, Fumarato, Quelato) combinadas con cofactores de absorción como Vitamina C, Folato y B12. Suave con el estómago, duro contra la anemia.',
      ru: 'ФерБуст решает проблему плохого усвоения железа и побочных эффектов. Использует 4 высокобиодоступные формы железа (Бисглицинат, Fe-Липосома, Фумарат, Хелат) в сочетании с кофакторами, такими как Витамин C, Фолат и B12. Мягкий для желудка, мощный против анемии.',
      ca: "FerBoost resol el problema de la mala absorció de ferro i efectes secundaris. Utilitza 4 formes de ferro altament biodisponibles (Bisglicinat, Fe-Liposoma, Fumarat, Quelat) combinades amb cofactors d'absorció com Vitamina C, Folat i B12. Suau amb l'estómac, dur contra l'anèmia.",
    },
    ingredients: [
      {
        en: '1. Iron Bisglycinate (Gentle Chelate)',
        es: '1. Bisglicinato de Hierro (Quelato Suave)',
        ru: '1. Бисглицинат железа (Мягкий хелат)',
        ca: '1. Bisglicinat de Ferro (Quelat Suau)',
      },
      {
        en: '2. Liposomal Iron (Cell Membrane Mimic)',
        es: '2. Hierro Liposomal (Imita Membrana Celular)',
        ru: '2. Липосомальное железо (Имитация клеточной мембраны)',
        ca: '2. Ferro Liposomal (Imita Membrana Cel·lular)',
      },
      {
        en: '3. Iron Fumarate (Standard Organic)',
        es: '3. Fumarato de Hierro (Orgánico Estándar)',
        ru: '3. Фумарат железа (Стандарт органический)',
        ca: '3. Fumarat de Ferro (Orgànic Estàndard)',
      },
      {
        en: '4. Iron Amino Acid Chelate',
        es: '4. Quelato de Aminoácidos de Hierro',
        ru: '4. Аминокислотный хелат железа',
        ca: "4. Quelat d'Aminoàcids de Ferro",
      },
      {
        en: 'Cofactors: Vitamin C, B9 (Folate), B12',
        es: 'Cofactores: Vitamina C, B9 (Folato), B12',
        ru: 'Кофакторы: Витамин C, B9 (Фолат), B12',
        ca: 'Cofactors: Vitamina C, B9 (Folat), B12',
      },
    ],
    benefits: [
      {
        en: 'Eliminates anemia symptoms (Fatigue, Pale Skin).',
        es: 'Elimina síntomas de anemia (Fatiga, Piel pálida).',
        ru: 'Устраняет симптомы анемии (Усталость, Бледность).',
        ca: "Elimina símptomes d'anèmia (Fatiga, Pell pàl·lida).",
      },
      {
        en: 'No constipation or nausea (Bisglycinate form).',
        es: 'Sin estreñimiento ni náuseas (forma Bisglicinato).',
        ru: 'Без запоров и тошноты (форма бисглицинат).',
        ca: 'Sense restrenyiment ni nàusees (forma Bisglicinat).',
      },
      {
        en: 'Fast ferritin restoration.',
        es: 'Restauración rápida de ferritina.',
        ru: 'Быстрое восстановление ферритина.',
        ca: 'Restauració ràpida de ferritina.',
      },
    ],
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/FerBoost_1.m7879r29h3koooogcg0wc4.jpg',
  },
  // --- CELL ELIXIR SERIES ---
  {
    id: 'CellGenetiX',
    slug: 'cellgenetix',
    name: { en: 'CellGenetiX', es: 'CellGenetiX', ru: 'CellGenetiX', ca: 'CellGenetiX' },
    category: 'Cell Elixir',
    description: {
      en: 'Genetic potential activator with Polyprenols & Astaxanthin.',
      es: 'Activador del potencial genético con Poliprenoles y Astaxantina.',
      ru: 'Активатор генетического потенциала с Полипренолами и Астаксантином.',
      ca: 'Activador del potencial genètic amb Poliprenols i Astaxantina.',
    },
    longDescription: {
      en: 'CellGenetiX is the flagship anti-aging formula focusing on telomere protection and mitochondrial health. It features rare Siberian Polyprenols (cell regeneration), Astaxanthin (super-antioxidant), and Black Cumin Seed Oil to protect DNA and extend cellular youth.',
      es: 'CellGenetiX es la fórmula antienvejecimiento insignia que se enfoca en la protección de los telómeros y la salud mitocondrial. Contiene raros Poliprenoles Siberianos (regeneración celular), Astaxantina (super-antioxidante) y Aceite de Comino Negro para proteger el ADN y extender la juventud celular.',
      ru: 'CellGenetiX — флагманская антивозрастная формула, направленная на защиту телемер и здоровье митохондрий. Содержит редкие сибирские полипренолы (клеточная регенерация), астаксантин (супер-антиоксидант) и масло черного тмина для защиты ДНК и продления молодости клеток.',
      ca: "CellGenetiX és la fórmula antienvelliment insígnia que s'enfoca en la protecció dels telòmers i la salut mitocondrial. Conté rars Poliprenols Siberians (regeneració cel·lular), Astaxantina (super-antioxidant) i Oli de Comí Negre per protegir l'ADN i estendre la joventut cel·lular.",
    },
    benefits: [
      {
        en: 'Protects telomeres and DNA.',
        es: 'Protege telómeros y ADN.',
        ru: 'Защищает телемеры и ДНК.',
        ca: 'Protegeix telòmers i ADN.',
      },
      {
        en: 'Powerful anti-inflammatory action.',
        es: 'Poderosa acción antiinflamatoria.',
        ru: 'Мощное противовоспалительное действие.',
        ca: 'Poderosa acció antiinflamatòria.',
      },
      {
        en: 'Regenerates liver cells.',
        es: 'Regenera células hepáticas.',
        ru: 'Регенерирует клетки печени.',
        ca: 'Regenera cèl·lules hepàtiques.',
      },
    ],
    ingredients: [
      {
        en: 'Siberian Fir Polyprenols',
        es: 'Poliprenoles de Abeto Siberiano',
        ru: 'Полипренолы Сибирской Пихты',
        ca: "Poliprenols d'Avet Siberià",
      },
      {
        en: 'Astaxanthin (Haematococcus pluvialis)',
        es: 'Astaxantina',
        ru: 'Астаксантин',
        ca: 'Astaxantina',
      },
      {
        en: 'Black Cumin Seed Oil',
        es: 'Aceite de Semilla de Comino Negro',
        ru: 'Масло Черного Тмина',
        ca: 'Oli de Llavor de Comí Negre',
      },
      { en: 'Betulin', es: 'Betulina', ru: 'Бетулин', ca: 'Betulina' },
      { en: 'Vitamin E', es: 'Vitamina E', ru: 'Витамин E', ca: 'Vitamina E' },
    ],
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/CellGenetiX_1.j72oivd3g9kk048ocww0kc.jpg',
  },
  // --- ADDITIONAL PRODUCTS (Fully Populated) ---
  {
    id: 'ParaDetox',
    slug: 'paradetox',
    name: {
      en: 'ParaDetox + XBi-A',
      es: 'ParaDetox + XBi-A',
      ru: 'ПараДетокс + XBi-A',
      ca: 'ParaDetox + XBi-A',
    },
    category: 'Additional',
    description: {
      en: 'Natural parasite cleanse and digestive support.',
      es: 'Limpieza natural de parásitos y apoyo digestivo.',
      ru: 'Натуральное очищение от паразитов и поддержка пищеварения.',
      ca: 'Neteja natural de paràsits i suport digestiu.',
    },
    longDescription: {
      en: 'ParaDetox is a comprehensive herbal defense system designed to cleanse the body of unwanted parasites and toxins. By combining potent anti-parasitic herbs like Wormwood and Black Walnut with digestive aids, it gently purifies your system, restoring intestinal balance and boosting overall vitality.',
      es: 'ParaDetox es un sistema de defensa herbal integral diseñado para limpiar el cuerpo de parásitos y toxinas no deseados. Al combinar hierbas antiparasitarias potentes como el Ajenjo y el Nogal Negro con ayudas digestivas, purifica suavemente su sistema, restaurando el equilibrio intestinal y aumentando la vitalidad general.',
      ru: 'ParaDetox — это комплексная травяная система защиты, разработанная для очищения организма от нежелательных паразитов и токсинов. Сочетая мощные противопаразитарные травы, такие как полынь и черный орех, с пищеварительными средствами, он мягко очищает вашу систему, восстанавливая кишечный баланс и повышая общий жизненный тонус.',
      ca: "ParaDetox és un sistema de defensa herbal integral dissenyat per netejar el cos de paràsits i toxines no desitjats. En combinar herbes antiparasitàries potents com el Donzell i la Noguera Negra amb ajudes digestives, purifica suaument el vostre sistema, restaurant l'equilibri intestinal i augmentant la vitalitat general.",
    },
    benefits: [
      {
        en: 'Eliminates parasites and mild fungal infections.',
        es: 'Elimina parásitos e infecciones fúngicas leves.',
        ru: 'Устраняет паразитов и легкие грибковые инфекции.',
        ca: 'Elimina paràsits i infeccions fúngiques lleus.',
      },
      {
        en: 'Detoxifies the liver and intestines.',
        es: 'Desintoxica el hígado y los intestinos.',
        ru: 'Детоксицирует печень и кишечник.',
        ca: 'Desintoxica el fetge i els intestins.',
      },
      {
        en: 'Improves digestion and nutrient absorption.',
        es: 'Mejora la digestión y la absorción de nutrientes.',
        ru: 'Улучшает пищеварение и усвоение питательных веществ.',
        ca: "Millora la digestió i l'absorció de nutrients.",
      },
    ],
    ingredients: [
      {
        en: 'Wormwood Extract',
        es: 'Extracto de Ajenjo',
        ru: 'Экстракт Полыни',
        ca: 'Extracte de Donzell',
      },
      {
        en: 'Black Walnut Hull',
        es: 'Cáscara de Nogal Negro',
        ru: 'Кожура Черного Ореха',
        ca: 'Closca de Noguera Negra',
      },
      { en: 'Clove Bud', es: 'Clavo', ru: 'Бутон гвоздики', ca: "Clau d'espècia" },
      {
        en: 'Grapefruit Seed Extract',
        es: 'Extracto de Semilla de Pomelo',
        ru: 'Экстракт грейпфрутовых косточек',
        ca: "Extracte de Llavor d'Aranja",
      },
    ],
    usage: {
      en: '2 capsules daily before meals for 15 days.',
      es: '2 cápsulas al día antes de las comidas durante 15 días.',
      ru: '2 капсулы в день до еды в течение 15 дней.',
      ca: '2 càpsules al dia abans dels àpats durant 15 dies.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/ParaDetox_1.m7879r29h3koooogcg0wc4.jpg',
  },
  {
    id: 'PHT-SustaHelp',
    slug: 'sustahelp',
    name: { en: 'SustaHelp', es: 'SustaHelp', ru: 'СустаХелп', ca: 'SustaHelp' },
    category: 'Additional',
    description: {
      en: 'Advanced joint support formula.',
      es: 'Fórmula avanzada de apoyo articular.',
      ru: 'Продвинутая формула для поддержки суставов.',
      ca: 'Fórmula avançada de suport articular.',
    },
    longDescription: {
      en: 'SustaHelp is your daily joint guardian. Formulated with key structural components like Glucosamine and Chondroitin, fortified with MSM for anti-inflammatory support. It promotes cartilage repair, reduces stiffness, and enhances flexibility for active living.',
      es: 'SustaHelp es su guardián diario de las articulaciones. Formulado con componentes estructurales clave como Glucosamina y Condroitina, fortificado con MSM para apoyo antiinflamatorio. Promueve la reparación del cartílago, reduce la rigidez y mejora la flexibilidad para una vida activa.',
      ru: 'СустаХелп — ваш ежедневный защитник суставов. Содержит ключевые структурные компоненты, такие как глюкозамин и хондроитин, усиленные МСМ для противовоспалительной поддержки. Способствует восстановлению хряща, уменьшает скованность и улучшает гибкость для активной жизни.',
      ca: 'SustaHelp és el vostre guardià diari de les articulacions. Formulat amb components estructurals clau com Glucosamina i Condroitina, fortificat amb MSM per a suport antiinflamatori. Promou la reparació del cartílag, redueix la rigidesa i millora la flexibilitat per a una vida activa.',
    },
    benefits: [
      {
        en: 'Reduces joint pain and inflammation.',
        es: 'Reduce el dolor y la inflamación articular.',
        ru: 'Уменьшает боль и воспаление в суставах.',
        ca: 'Redueix el dolor i la inflamació articular.',
      },
      {
        en: 'Improves mobility and flexibility.',
        es: 'Mejora la movilidad y flexibilidad.',
        ru: 'Улучшает подвижность и гибкость.',
        ca: 'Millora la mobilitat i flexibilitat.',
      },
      {
        en: 'Protects cartilage from degeneration.',
        es: 'Protege el cartílago de la degeneración.',
        ru: 'Защищает хрящ от дегенерации.',
        ca: 'Protegeix el cartílag de la degeneració.',
      },
    ],
    ingredients: [
      {
        en: 'Glucosamine Sulfate',
        es: 'Sulfato de Glucosamina',
        ru: 'Глюкозамин сульфат',
        ca: 'Sulfat de Glucosamina',
      },
      {
        en: 'Chondroitin Sulfate',
        es: 'Sulfato de Condroitina',
        ru: 'Хондроитин сульфат',
        ca: 'Sulfat de Condroitina',
      },
      {
        en: 'MSM (Methylsulfonylmethane)',
        es: 'MSM (Metilsulfonilmetano)',
        ru: 'МСМ (Метилсульфонилметан)',
        ca: 'MSM (Metilsulfonilmetà)',
      },
      { en: 'Vitamin C', es: 'Vitamina C', ru: 'Витамин C', ca: 'Vitamina C' },
    ],
    usage: {
      en: '2 capsules daily with meals.',
      es: '2 cápsulas al día con las comidas.',
      ru: '2 капсулы в день во время еды.',
      ca: '2 càpsules al dia amb els àpats.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/SustaHelp_1.jpg',
  },
  {
    id: 'Cats-Claw-XBi-A',
    slug: 'cats-claw-xbi-a',
    name: {
      en: "Cat's Claw + XBi-A",
      es: 'Uña de Gato + XBi-A',
      ru: 'Кошачий коготь + XBi-A',
      ca: 'Urpa de Gat + XBi-A',
    },
    category: 'Additional',
    description: {
      en: 'Immune modulator and viral defense.',
      es: 'Modulador inmunológico y defensa viral.',
      ru: 'Иммуномодулятор и защита от вирусов.',
      ca: 'Modulador immunitari i defensa viral.',
    },
    longDescription: {
      en: 'Known as the "Sacred Herb of the Incas", Cat\'s Claw is a powerful immunomodulator. Enhanced with XBi-A technology, this extract helps the body fight viral infections, reduces chronic inflammation, and supports cellular DNA repair.',
      es: 'Conocida como la "Hierba Sagrada de los Incas", la Uña de Gato es un poderoso inmunomodulador. Mejorado con tecnología XBi-A, este extracto ayuda al cuerpo a combatir infecciones virales, reduce la inflamación crónica y apoya la reparación del ADN celular.',
      ru: 'Известный как "Священная трава инков", Кошачий коготь является мощным иммуномодулятором. Усиленный технологией XBi-A, этот экстракт помогает организму бороться с вирусными инфекциями, уменьшает хроническое воспаление и поддерживает восстановление ДНК клеток.',
      ca: "Coneguda com l'\"Herba Sagrada dels Inques\", l'Urpa de Gat és un potent immunomodulador. Millorat amb tecnologia XBi-A, aquest extracte ajuda el cos a combatre infeccions virals, redueix la inflamació crònica i suporta la reparació de l'ADN cel·lular.",
    },
    benefits: [
      {
        en: 'Boosts antiviral immunity.',
        es: 'Aumenta la inmunidad antiviral.',
        ru: 'Повышает противовирусный иммунитет.',
        ca: 'Augmenta la immunitat antiviral.',
      },
      {
        en: 'Potent anti-inflammatory.',
        es: 'Potente antiinflamatorio.',
        ru: 'Мощное противовоспалительное.',
        ca: 'Potent antiinflamatori.',
      },
      {
        en: 'Cytostatic properties (cellular health).',
        es: 'Propiedades citostáticas (salud celular).',
        ru: 'Цитостатические свойства (здоровье клеток).',
        ca: 'Propietats citostàtiques (salut cel·lular).',
      },
    ],
    ingredients: [
      {
        en: "Cat's Claw Bark Extract",
        es: 'Extracto de Corteza de Uña de Gato',
        ru: 'Экстракт коры кошачьего когтя',
        ca: "Extracte d'Escorça d'Urpa de Gat",
      },
      { en: 'XBi-A Complex', es: 'Complejo XBi-A', ru: 'Комплекс XBi-A', ca: 'Complex XBi-A' },
    ],
    usage: {
      en: '1-2 capsules daily.',
      es: '1-2 cápsulas al día.',
      ru: '1-2 капсулы в день.',
      ca: '1-2 càpsules al dia.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/CatsClaw_1.jpg',
  },
  {
    id: 'Oculyz-XBi-A',
    slug: 'oculyz-xbi-a',
    name: {
      en: 'Oculyz + XBi-A',
      es: 'Oculyz + XBi-A',
      ru: 'Окулиз + XBi-A',
      ca: 'Oculyz + XBi-A',
    },
    category: 'Additional',
    description: {
      en: 'Complete eye health protection.',
      es: 'Protección completa para la salud ocular.',
      ru: 'Полная защита здоровья глаз.',
      ca: 'Protecció completa per a la salut ocular.',
    },
    longDescription: {
      en: 'Protect your vision in the digital age. Oculyz provides a full spectrum of carotenoids (Lutein, Zeaxanthin) and berry antioxidants to shield eyes from blue light damage, improve night vision, and reduce eye strain.',
      es: 'Proteja su visión en la era digital. Oculyz proporciona un espectro completo de carotenoides (Luteína, Zeaxantina) y antioxidantes de bayas para proteger los ojos del daño de la luz azul, mejorar la visión nocturna y reducir la fatiga ocular.',
      ru: 'Защитите свое зрение в цифровую эпоху. Окулиз обеспечивает полный спектр каротиноидов (лютеин, зеаксантин) и ягодных антиоксидантов для защиты глаз от повреждения синим светом, улучшения ночного зрения и снижения усталости глаз.',
      ca: "Protegiu la vostra visió en l'era digital. Oculyz proporciona un espectre complet de carotenoides (Luteïna, Zeaxantina) i antioxidants de baies per protegir els ulls del dany de la llum blava, millorar la visió nocturna i reduir la fatiga ocular.",
    },
    benefits: [
      {
        en: 'Filters harmful blue light.',
        es: 'Filtra la luz azul dañina.',
        ru: 'Фильтрует вредный синий свет.',
        ca: 'Filtra la llum blava nociva.',
      },
      {
        en: 'Reduces digital eye strain.',
        es: 'Reduce la fatiga ocular digital.',
        ru: 'Снижает цифровую усталость глаз.',
        ca: 'Redueix la fatiga ocular digital.',
      },
      {
        en: 'Supports retinal health.',
        es: 'Apoya la salud de la retina.',
        ru: 'Поддерживает здоровье сетчатки.',
        ca: 'Suporta la salut de la retina.',
      },
    ],
    ingredients: [
      {
        en: 'Lutein & Zeaxanthin',
        es: 'Luteína y Zeaxantina',
        ru: 'Лютеин и Зеаксантин',
        ca: 'Luteïna i Zeaxantina',
      },
      {
        en: 'Bilberry Extract',
        es: 'Extracto de Arándano',
        ru: 'Экстракт Черники',
        ca: 'Extracte de Nabiu',
      },
      { en: 'Beta-carotene', es: 'Betacaroteno', ru: 'Бета-каротин', ca: 'Betacarotè' },
      {
        en: 'Zinc & Vitamin A',
        es: 'Zinc y Vitamina A',
        ru: 'Цинк и Витамин А',
        ca: 'Zinc i Vitamina A',
      },
    ],
    usage: {
      en: '1 capsule daily.',
      es: '1 cápsula al día.',
      ru: '1 капсула в день.',
      ca: '1 càpsula al dia.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/Oculyz_1.jpg',
  },
  {
    id: 'VenoBalance',
    slug: 'venobalance',
    name: { en: 'VenoBalance', es: 'VenoBalance', ru: 'ВеноБаланс', ca: 'VenoBalance' },
    category: 'Additional',
    description: {
      en: 'Vein health and circulation support.',
      es: 'Salud venosa y apoyo a la circulación.',
      ru: 'Здоровье вен и поддержка кровообращения.',
      ca: 'Salut venosa i suport a la circulació.',
    },
    longDescription: {
      en: 'Say goodbye to heavy legs. VenoBalance targets the vascular system with a potent blend of micronized Diosmin and Hesperidin. It strengthens vein walls, improves venous return, and reduces swelling and discomfort in the legs.',
      es: 'Diga adiós a las piernas pesadas. VenoBalance se dirige al sistema vascular con una potente mezcla de Diosmina y Hesperidina micronizadas. Fortalece las paredes de las venas, mejora el retorno venoso y reduce la hinchazón y las molestias en las piernas.',
      ru: 'Попрощайтесь с тяжестью в ногах. ВеноБаланс воздействует на сосудистую систему мощной смесью микронизированных диосмина и гесперидина. Он укрепляет стенки вен, улучшает венозный отток, уменьшает отеки и дискомфорт в ногах.',
      ca: 'Digueu adéu a les cames pesades. VenoBalance es dirigeix al sistema vascular amb una potent barreja de Diosmina i Hesperidina micronitzades. Enforteix les parets de les venes, millora el retorn venós i redueix la inflor i les molèsties a les cames.',
    },
    benefits: [
      {
        en: 'Relieves leg heaviness and swelling.',
        es: 'Alivia la pesadez y la hinchazón de las piernas.',
        ru: 'Снимает тяжесть и отечность в ногах.',
        ca: 'Alleugera la pesadesa i la inflor de les cames.',
      },
      {
        en: 'Strengthens capillaries and veins.',
        es: 'Fortalece capilares y venas.',
        ru: 'Укрепляет капилляры и вены.',
        ca: 'Enforteix capil·lars i venes.',
      },
      {
        en: 'Improves microcirculation.',
        es: 'Mejora la microcirculación.',
        ru: 'Улучшает микроциркуляцию.',
        ca: 'Millora la microcirculació.',
      },
    ],
    ingredients: [
      {
        en: 'Diosmin & Hesperidin (9:1)',
        es: 'Diosmina y Hesperidina (9:1)',
        ru: 'Диосмин и Гесперидин (9:1)',
        ca: 'Diosmina i Hesperidina (9:1)',
      },
      {
        en: 'Horse Chestnut Extract',
        es: 'Extracto de Castaño de Indias',
        ru: 'Экстракт Конского Каштана',
        ca: "Extracte de Castanyer d'Índies",
      },
      {
        en: 'Red Vine Leaf',
        es: 'Hoja de Vid Roja',
        ru: 'Лист красного винограда',
        ca: 'Fulla de Vinya Roja',
      },
    ],
    usage: {
      en: '1 tablet twice daily.',
      es: '1 tableta dos veces al día.',
      ru: '1 таблетка два раза в день.',
      ca: '1 tableta dos cops al dia.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/VenoBalance_1.jpg',
  },
  {
    id: 'Slim-MCT',
    slug: 'slim-mct',
    name: { en: 'Slim MCT', es: 'Slim MCT', ru: 'Slim MCT', ca: 'Slim MCT' },
    category: 'G-Keto',
    description: {
      en: 'MCT Oil for keto energy and metabolism.',
      es: 'Aceite MCT para energía keto y metabolismo.',
      ru: 'Масло МСТ для кето-энергии и метаболизма.',
      ca: 'Oli MCT per a energia keto i metabolisme.',
    },
    longDescription: {
      en: 'Pure, functional fuel for your brain and body. Slim MCT provides a clean source of ketone energy derived from coconut oil. Ideal for ketogenic diets, intermittent fasting, or anyone needing a mental focus boost without the crash of sugar.',
      es: 'Combustible puro y funcional para su cerebro y cuerpo. Slim MCT proporciona una fuente limpia de energía cetogénica derivada del aceite de coco. Ideal para dietas cetogénicas, ayuno intermitente o cualquier persona que necesite un impulso de enfoque mental sin la caída del azúcar.',
      ru: 'Чистое, функциональное топливо для вашего мозга и тела. Slim MCT обеспечивает чистый источник кетоновой энергии, полученной из кокосового масла. Идеально подходит для кето-диет, интервального голодания или для всех, кому нужен заряд умственной концентрации без скачка сахара.',
      ca: "Combustible pur i funcional per al vostre cervell i cos. Slim MCT proporciona una font neta d'energia cetogènica derivada de l'oli de coco. Ideal per a dietes cetogèniques, dejuni intermitent o qualsevol persona que necessiti un impuls d'enfocament mental sense la caiguda del sucre.",
    },
    benefits: [
      {
        en: 'Instant energy for brain & muscle.',
        es: 'Energía instantánea para cerebro y músculo.',
        ru: 'Мгновенная энергия для мозга и мышц.',
        ca: 'Energia instantània per a cervell i múscul.',
      },
      {
        en: 'Promotes fat burning (Ketosis).',
        es: 'Promueve la quema de grasa (Cetosis).',
        ru: 'Способствует сжиганию жира (Кетоз).',
        ca: 'Promou la crema de greix (Cetosi).',
      },
      {
        en: 'Controls appetite.',
        es: 'Controla el apetito.',
        ru: 'Контролирует аппетит.',
        ca: 'Controla la gana.',
      },
    ],
    ingredients: [
      {
        en: 'MCT Oil (C8 Caprylic Acid)',
        es: 'Aceite MCT (C8 Ácido Caprílico)',
        ru: 'Масло МСТ (C8 Каприловая кислота)',
        ca: 'Oli MCT (C8 Àcid Caprílic)',
      },
      {
        en: 'MCT Oil (C10 Capric Acid)',
        es: 'Aceite MCT (C10 Ácido Cáprico)',
        ru: 'Масло МСТ (C10 Каприновая кислота)',
        ca: 'Oli MCT (C10 Àcid Càpric)',
      },
    ],
    usage: {
      en: 'Add to coffee, smoothies, or salads.',
      es: 'Añadir al café, batidos o ensaladas.',
      ru: 'Добавлять в кофе, смузи или салаты.',
      ca: 'Afegir al cafè, batuts o amanides.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/SlimMCT_1.jpg',
  },
  {
    id: 'Skin-Elixir',
    slug: 'skin-elixir',
    name: { en: 'Skin Elixir', es: 'Skin Elixir', ru: 'Skin Elixir', ca: 'Skin Elixir' },
    category: 'Beauty',
    description: {
      en: 'Facial cream for hydration and repair.',
      es: 'Crema facial para hidratación y reparación.',
      ru: 'Крем для лица для увлажнения и восстановления.',
      ca: 'Crema facial per a hidratació i reparació.',
    },
    longDescription: {
      en: "A luxurious liposomal cream that mimics the structure of skin cells. Skin Elixir delivers deep hydration and active peptides directly to the dermis, smoothing fine lines and restoring the skin's natural barrier.",
      es: 'Una lujosa crema liposomal que imita la estructura de las células de la piel. Skin Elixir entrega hidratación profunda y péptidos activos directamente a la dermis, suavizando las líneas finas y restaurando la barrera natural de la piel.',
      ru: 'Роскошный липосомальный крем, имитирующий структуру клеток кожи. Skin Elixir доставляет глубокое увлажнение и активные пептиды непосредственно в дерму, разглаживая мелкие морщины и восстанавливая естественный барьер кожи.',
      ca: "Una luxosa crema liposomal que imita l'estructura de les cèl·lules de la pell. Skin Elixir entrega hidratació profunda i pèptids actius directament a la dermis, suavitzant les línies fines i restaurant la barrera natural de la pell.",
    },
    benefits: [
      {
        en: 'Deep liposomal hydration.',
        es: 'Hidratación liposomal profunda.',
        ru: 'Глубокое липосомальное увлажнение.',
        ca: 'Hidratació liposomal profunda.',
      },
      {
        en: 'Stimulates collagen production.',
        es: 'Estimula la producción de colágeno.',
        ru: 'Стимулирует выработку коллагена.',
        ca: 'Estimula la producció de col·lagen.',
      },
      {
        en: 'Restores skin elasticity.',
        es: 'Restaura la elasticidad de la piel.',
        ru: 'Восстанавливает эластичность кожи.',
        ca: "Restaura l'elasticitat de la pell.",
      },
    ],
    ingredients: [
      {
        en: 'Signal Peptides',
        es: 'Péptidos señal',
        ru: 'Сигнальные пептиды',
        ca: 'Pèptids senyal',
      },
      {
        en: 'Low-Molecular Hyaluronic Acid',
        es: 'Ácido Hialurónico de bajo peso molecular',
        ru: 'Низкомолекулярная гиалуроновая кислота',
        ca: 'Àcid Hialurònic de baix pes molecular',
      },
      {
        en: 'Plant Stem Cells',
        es: 'Células madre vegetales',
        ru: 'Растительные стволовые клетки',
        ca: 'Cèl·lules mare vegetals',
      },
    ],
    usage: {
      en: 'Apply morning and night to clean face.',
      es: 'Aplicar mañana y noche sobre el rostro limpio.',
      ru: 'Наносить утром и вечером на чистое лицо.',
      ca: 'Aplicar matí i nit sobre el rostre net.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/SkinElixir_1.jpg',
  },
  {
    id: 'Youth-Secret',
    slug: 'youth-secret',
    name: { en: 'Youth Secret', es: 'Youth Secret', ru: 'Youth Secret', ca: 'Youth Secret' },
    category: 'Beauty',
    description: {
      en: 'Anti-aging cream for visible rejuvenation.',
      es: 'Crema antienvejecimiento para rejuvenecimiento visible.',
      ru: 'Антивозрастной крем для видимого омоложения.',
      ca: 'Crema antienvelliment per a rejoveniment visible.',
    },
    longDescription: {
      en: 'Unlock the secret to ageless skin. This advanced formula combines powerful antioxidants with a safe, plant-based retinol alternative (Bakuchiol) to target deep wrinkles and pigmentation without irritation.',
      es: 'Descubra el secreto de una piel eterna. Esta fórmula avanzada combina poderosos antioxidantes con una alternativa segura al retinol basada en plantas (Bakuchiol) para combatir arrugas profundas y pigmentación sin irritación.',
      ru: 'Откройте секрет вечной молодости кожи. Эта продвинутая формула сочетает мощные антиоксиданты с безопасной растительной альтернативой ретинолу (Бакучиол) для борьбы с глубокими морщинами и пигментацией без раздражения.',
      ca: "Descobriu el secret d'una pell eterna. Aquesta fórmula avançada combina poderosos antioxidants amb una alternativa segura al retinol basada en plantes (Bakuchiol) per combatre arrugues profundes i pigmentació sense irritació.",
    },
    benefits: [
      {
        en: 'Visibly reduces wrinkles.',
        es: 'Reduce visiblemente las arrugas.',
        ru: 'Видимо сокращает морщины.',
        ca: 'Redueix visiblement les arrugues.',
      },
      {
        en: 'Evens skin tone.',
        es: 'Unifica el tono de la piel.',
        ru: 'Выравнивает тон кожи.',
        ca: 'Unifica el to de la pell.',
      },
      {
        en: 'Lifting effect.',
        es: 'Efecto lifting.',
        ru: 'Лиффтинг-эффект.',
        ca: 'Efecte lifting.',
      },
    ],
    ingredients: [
      {
        en: 'Bakuchiol (Bio-Retinol)',
        es: 'Bakuchiol (Bio-Retinol)',
        ru: 'Бакучиол (Био-Ретинол)',
        ca: 'Bakuchiol (Bio-Retinol)',
      },
      { en: 'Resveratrol', es: 'Resveratrol', ru: 'Ресвератрол', ca: 'Resveratrol' },
      { en: 'Precious Oils', es: 'Aceites preciosos', ru: 'Ценные масла', ca: 'Olis preciosos' },
    ],
    usage: {
      en: 'Apply at night for best results.',
      es: 'Aplicar por la noche para mejores resultados.',
      ru: 'Наносить на ночь для лучших результатов.',
      ca: 'Aplicar a la nit per a millors resultats.',
    },
    image: 'https://front.agenyz.eu/resize/w1413/f9/yh/YouthSecret_1.jpg',
  },
];

export const categories = ['All', 'XBi-A Series', 'Cell Elixir', 'G-Keto', 'Beauty', 'Additional'];

// Add helper specifically for getting ingredients list in ID layout component
export const getIngredients = (prod: Product, lang: string): string[] => {
  if (!prod.ingredients) return [];
  return prod.ingredients.map((i) => getLocalized(i, lang));
};
