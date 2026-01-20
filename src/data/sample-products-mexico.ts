/**
 * Datos de productos de muestra para México - Mercado Libre
 * Sample Product Data for Mexico - Mercado Libre Marketplace
 * Traducido de datos de productos LG Germany OLED C5
 */

import { LGProductData, GeneratedContent, ContentPipeline } from '@/types/product';

// Productos de muestra de LG México - OLED C5
export const mexicoProducts: LGProductData[] = [
  {
    id: 'oled48c5-mx',
    sku: 'OLED48C5PSA',
    country: 'mx',
    sourceUrl: 'https://www.lg.com/mx/televisores/oled-evo/oled48c5psa/',
    crawledAt: '2026-01-20T03:40:13.854Z',
    product: {
      title: 'LG OLED evo AI C5 48 Pulgadas 4K Smart TV',
      shortDescription: 'Experimenta negros perfectos y colores vibrantes con el procesador α9 AI Gen8.',
      longDescription: 'El LG OLED evo C5 ofrece una experiencia de visualización inigualable con píxeles autoiluminados que crean negros perfectos y más de mil millones de colores. El procesador α9 AI Gen8 optimiza la imagen y el sonido en tiempo real para cada escena, con funciones de IA que te ayudan a buscar y seleccionar contenido fácilmente.',
      category: {
        primary: 'Televisores',
        secondary: 'OLED TV',
        tertiary: 'OLED evo C5',
        breadcrumb: ['Inicio', 'Televisores y Audio', 'OLED evo', 'OLED C5'],
      },
      brand: 'LG',
    },
    pricing: {
      currency: 'MXN',
      currentPrice: 24999,
      originalPrice: 29999,
      discountPercent: 17,
      priceValidUntil: '2026-02-28',
    },
    images: {
      main: {
        id: 'main-oled48c5-mx',
        url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-01.jpg',
        type: 'main',
        width: 800,
        height: 531,
        altText: 'LG OLED evo AI C5 48 Pulgadas Vista Frontal',
        sortOrder: 0,
      },
      gallery: [
        {
          id: 'gallery-1-oled48c5-mx',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-03.jpg',
          type: 'gallery',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 Vista Posterior',
          sortOrder: 1,
        },
        {
          id: 'gallery-2-oled48c5-mx',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-04.jpg',
          type: 'gallery',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 Vista Lateral',
          sortOrder: 2,
        },
        {
          id: 'lifestyle-1-oled48c5-mx',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/_he/2025/tvs/gallery/oled48c59lb/Perfect-Black-dz.jpg',
          type: 'lifestyle',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 en Sala de Estar',
          sortOrder: 3,
        },
      ],
      banners: [
        {
          id: 'banner-1-oled48c5-mx',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/_he/2025/tvs/gallery/oled48c59lb/a9-Prozessor-dz.jpg',
          type: 'banner',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 Banner Promocional',
          containsText: true,
          extractedText: 'Negros perfectos. Contraste infinito.',
          sortOrder: 0,
        },
      ],
    },
    specifications: {
      raw: [
        { group: 'Pantalla', name: 'Tamaño de Pantalla', value: '48', unit: 'pulgadas' },
        { group: 'Pantalla', name: 'Resolución', value: '3840 x 2160', unit: 'píxeles' },
        { group: 'Pantalla', name: 'Tipo de Panel', value: 'OLED evo' },
        { group: 'Pantalla', name: 'Tasa de Refresco', value: '120', unit: 'Hz' },
        { group: 'Pantalla', name: 'HDR', value: 'Dolby Vision, HDR10, HLG' },
        { group: 'Procesador', name: 'Procesador', value: 'α9 AI Processor Gen8' },
        { group: 'Audio', name: 'Potencia de Salida', value: '40', unit: 'W' },
        { group: 'Audio', name: 'Altavoces', value: '2.2 Canales' },
        { group: 'Audio', name: 'Dolby Atmos', value: 'Sí' },
        { group: 'Smart TV', name: 'Sistema Operativo', value: 'webOS 25' },
        { group: 'Smart TV', name: 'Asistente de Voz', value: 'LG ThinQ AI, Alexa, Google Assistant' },
        { group: 'Conectividad', name: 'HDMI', value: '4x HDMI 2.1' },
        { group: 'Conectividad', name: 'USB', value: '3x USB' },
        { group: 'Conectividad', name: 'WLAN', value: 'Wi-Fi 6E' },
        { group: 'Gaming', name: 'NVIDIA G-SYNC', value: 'Sí' },
        { group: 'Gaming', name: 'AMD FreeSync Premium', value: 'Sí' },
        { group: 'Gaming', name: 'VRR', value: 'Sí' },
        { group: 'Dimensiones', name: 'Con Base (AnxAlxPr)', value: '1071 x 675 x 239', unit: 'mm' },
        { group: 'Dimensiones', name: 'Sin Base (AnxAlxPr)', value: '1071 x 620 x 45', unit: 'mm' },
        { group: 'Peso', name: 'Con Base', value: '14.9', unit: 'kg' },
        { group: 'Peso', name: 'Sin Base', value: '11.3', unit: 'kg' },
        { group: 'Energía', name: 'Clase de Eficiencia Energética', value: 'G' },
        { group: 'Energía', name: 'Consumo de Energía (SDR)', value: '85', unit: 'W' },
      ],
      normalized: {
        dimensions: { width: 1071, height: 620, depth: 45, unit: 'mm' },
        weight: { value: 11.3, unit: 'kg' },
        power: { consumption: 85, voltage: '127V~', energyClass: 'G' },
        screenSize: 48,
        resolution: '4K UHD (3840x2160)',
      },
    },
    marketing: {
      usps: [
        {
          headline: 'Procesador α9 AI Gen8',
          description: 'Optimización inteligente de imagen y sonido con Deep Learning',
          icon: 'processor',
        },
        {
          headline: 'Negros Perfectos',
          description: 'Píxeles autoiluminados para un contraste infinito',
          icon: 'contrast',
        },
        {
          headline: '4K 120Hz Gaming',
          description: 'NVIDIA G-SYNC y AMD FreeSync Premium para gaming fluido',
          icon: 'gaming',
        },
        {
          headline: 'Dolby Vision & Atmos',
          description: 'Experiencia cinematográfica con sonido envolvente',
          icon: 'dolby',
        },
      ],
      features: [
        {
          title: 'Tecnología OLED evo',
          description: 'La siguiente generación de tecnología OLED con imágenes más brillantes y colores más vibrantes.',
          image: 'https://www.lg.com/mx/images/tv/features/oled-evo.jpg',
        },
        {
          title: 'AI Picture Pro',
          description: 'Optimización de imagen impulsada por IA que reconoce géneros y optimiza automáticamente brillo, nitidez y contraste.',
          image: 'https://www.lg.com/mx/images/tv/features/ai-picture.jpg',
        },
        {
          title: 'webOS 25',
          description: 'Recomendaciones personalizadas y acceso rápido a todos tus servicios de streaming.',
          image: 'https://www.lg.com/mx/images/tv/features/webos25.jpg',
        },
      ],
      awards: ['CES 2025 Innovation Award', 'Red Dot Design Award 2025'],
      certifications: [
        { name: 'TÜV Eye Comfort Display', validUntil: '2026-12' },
        { name: 'Netflix Calibrated', validUntil: '2026-12' },
      ],
    },
    seo: {
      metaTitle: 'LG OLED evo AI C5 48 Pulgadas 4K Smart TV | OLED48C5PSA | LG México',
      metaDescription: 'Descubre el LG OLED evo TV C5 con procesador α9 AI Gen8, negros perfectos y Dolby Vision. ¡Compra ahora y disfruta de la mejor experiencia!',
      keywords: ['LG OLED', 'OLED TV', '48 pulgadas', '4K TV', 'Smart TV', 'Dolby Vision', 'Gaming TV', 'televisor OLED'],
      canonicalUrl: 'https://www.lg.com/mx/televisores/oled-evo/oled48c5psa/',
      structuredData: {
        '@type': 'Product',
        name: 'LG OLED evo AI C5 48 Pulgadas 4K Smart TV',
        brand: { '@type': 'Brand', name: 'LG' },
      },
    },
    availability: {
      inStock: true,
      stockLevel: 'in_stock',
      deliveryEstimate: 'Entrega en 2-4 días hábiles',
    },
    related: {
      accessories: ['SP9YA', 'WM25'],
      similarProducts: ['OLED55C5PSA', 'OLED65C5PSA', 'OLED65G5PSA'],
      bundles: ['OLED48C5PSA-BUNDLE-SP9YA'],
    },
    metadata: {
      crawlStatus: 'success',
      crawlDuration: 4500,
      pageLoadTime: 2100,
      version: 1,
    },
  },
];

// Contenido generado para Mercado Libre México
export const mexicoGeneratedContent: GeneratedContent[] = [
  {
    id: 'gen-oled48c5-mx-mercadolibre-listing',
    productId: 'oled48c5-mx',
    platform: 'mercadolibre',
    contentType: 'full_package',
    status: 'pending_review',
    content: {
      title: 'Smart TV LG OLED Evo 48" 4K 120Hz Gaming C5 Dolby Vision',
      description: `# LG OLED evo AI C5 48 Pulgadas 4K Smart TV

## ¿Por qué elegir LG OLED evo C5?

El LG OLED evo C5 es el televisor perfecto para quienes buscan la mejor calidad de imagen del mercado. Con su tecnología OLED evo, cada píxel se ilumina de forma independiente, creando negros perfectos y un contraste infinito que ningún LED puede igualar.

## Características Principales

### Procesador α9 AI Gen8
El cerebro del televisor utiliza inteligencia artificial avanzada para:
- Analizar cada escena en tiempo real
- Optimizar automáticamente brillo, color y contraste
- Mejorar la calidad de imagen de cualquier fuente
- Escalar contenido de baja resolución a calidad cercana a 4K

### Experiencia Gaming Definitiva
- **4K a 120Hz**: Imágenes ultra fluidas para gaming competitivo
- **NVIDIA G-SYNC**: Sincronización perfecta con tarjetas gráficas NVIDIA
- **AMD FreeSync Premium**: Compatible con consolas y PCs AMD
- **VRR y ALLM**: Sin screen tearing y latencia mínima automática
- **Input Lag de solo 0.1ms**: Reacción instantánea a tus comandos

### Dolby Vision IQ y Dolby Atmos
- HDR dinámico que ajusta la imagen según la iluminación de tu sala
- Sonido envolvente 3D sin necesidad de bocinas adicionales
- Compatible con contenido Dolby de Netflix, Disney+, Apple TV+ y más

### webOS 25 - Sistema Operativo Inteligente
- Interfaz intuitiva y personalizable
- Acceso directo a Netflix, Prime Video, Disney+, HBO Max, YouTube y más
- Control por voz con Alexa, Google Assistant y ThinQ AI
- Magic Remote incluido con control de puntero

## Especificaciones Técnicas

| Característica | Especificación |
|----------------|----------------|
| Tamaño de Pantalla | 48 pulgadas |
| Resolución | 4K UHD (3840x2160) |
| Tipo de Panel | OLED evo |
| Tasa de Refresco | 120Hz |
| HDR | Dolby Vision IQ, HDR10, HLG |
| Procesador | α9 AI Processor Gen8 |
| Audio | 40W 2.2 canales, Dolby Atmos |
| Conectividad | 4x HDMI 2.1, 3x USB, Wi-Fi 6E, Bluetooth 5.1 |
| Dimensiones (sin base) | 1071 x 620 x 45 mm |
| Peso (sin base) | 11.3 kg |

## Contenido de la Caja
- Televisor LG OLED48C5PSA
- Magic Remote con control de voz
- Base de mesa
- Manual de usuario
- Cable de alimentación

## Garantía
- **2 años de garantía oficial LG México**
- **2 años de garantía contra burn-in del panel**
- Servicio técnico autorizado en todo el país

## Envío
- Envío gratis a todo México
- Empaque reforzado para máxima protección
- Rastreo en tiempo real

---

**¿Tienes dudas?** Escríbenos por mensaje y te respondemos a la brevedad.

**Somos vendedor oficial LG** - Garantía y factura incluidas.`,
      bulletPoints: [
        'Pantalla OLED evo 48" con negros perfectos y contraste infinito',
        'Procesador α9 AI Gen8 con optimización inteligente de imagen',
        '4K 120Hz ideal para gaming con G-SYNC y FreeSync Premium',
        'Dolby Vision IQ y Dolby Atmos para experiencia cinematográfica',
        'webOS 25 con todas las apps de streaming incluidas',
        'Magic Remote con control de voz incluido',
        'Input lag de 0.1ms perfecto para gamers competitivos',
        '2 años de garantía oficial LG México',
        'Envío gratis a todo el país',
        'Factura fiscal disponible',
      ],
    },
    generatedAt: '2026-01-20T16:00:00Z',
  },
];

// Pipeline para México
export const mexicoPipelines: ContentPipeline[] = [
  {
    id: 'pipeline-oled48c5-mx-mercadolibre',
    productId: 'oled48c5-mx',
    targetPlatforms: ['mercadolibre'],
    channel: '3p',
    status: 'in_progress',
    createdAt: '2026-01-20T15:00:00Z',
    steps: [
      {
        id: 'step-1',
        name: 'Verificación de Imágenes',
        status: 'completed',
        startedAt: '2026-01-20T15:00:00Z',
        completedAt: '2026-01-20T15:03:00Z',
        duration: 180000,
        output: {
          imagesVerified: 4,
          specsVerified: true,
          sizeCompliant: true,
          whiteBackgroundCompliant: true
        },
      },
      {
        id: 'step-2',
        name: 'Verificación de Especificaciones',
        status: 'completed',
        startedAt: '2026-01-20T15:03:00Z',
        completedAt: '2026-01-20T15:05:00Z',
        duration: 120000,
        output: { specsValidated: 24, issuesFound: 0 },
      },
      {
        id: 'step-3',
        name: 'Verificación de Cumplimiento',
        status: 'completed',
        startedAt: '2026-01-20T15:05:00Z',
        completedAt: '2026-01-20T15:08:00Z',
        duration: 180000,
        output: {
          complianceScore: 98,
          warnings: 0,
          titleLength: 58,
          titleMaxAllowed: 60
        },
      },
      {
        id: 'step-4',
        name: 'Generación de Imágenes de Producto',
        status: 'completed',
        startedAt: '2026-01-20T15:08:00Z',
        completedAt: '2026-01-20T15:18:00Z',
        duration: 600000,
        output: {
          mainImageGenerated: true,
          galleryImagesGenerated: 4,
          allWhiteBackground: true
        },
      },
      {
        id: 'step-5',
        name: 'Generación de Descripción',
        status: 'completed',
        startedAt: '2026-01-20T15:18:00Z',
        completedAt: '2026-01-20T15:25:00Z',
        duration: 420000,
        output: {
          descriptionGenerated: true,
          wordCount: 485,
          bulletPointsCount: 10
        },
      },
      {
        id: 'step-6',
        name: 'Optimización SEO',
        status: 'in_progress',
        startedAt: '2026-01-20T15:25:00Z',
      },
      {
        id: 'step-7',
        name: 'Revisión Humana',
        status: 'pending',
      },
      {
        id: 'step-8',
        name: 'Publicación en Mercado Libre',
        status: 'pending',
      },
    ],
  },
];

// Configuración de plataformas para México
export const mexicoPlatformConfigs = {
  mercadolibre: {
    name: 'Mercado Libre México',
    logo: '/platforms/mercadolibre.svg',
    color: '#FFE600',
    requirements: {
      imageSize: { width: 1200, height: 1200 },
      minImageSize: { width: 500, height: 500 },
      titleMaxLength: 60,
      descriptionMaxLength: 50000, // Mercado Libre permite descripciones largas
      bulletPointsMax: 10,
      minImages: 1,
      maxImages: 12,
      whiteBackgroundRequired: true, // Imagen principal debe tener fondo blanco
      noWatermarks: true,
      noText: true, // Sin texto en imágenes
    },
    fees: {
      commissionRate: 0.175, // 12.5% - 22.5% dependiendo de la categoría
      shippingSubsidy: true,
    },
    categories: {
      electronics: {
        path: 'Electrónica, Audio y Video > TV y Video > Televisores',
        commissionRate: 0.175, // 17.5% para electrónica
      },
    },
    language: 'es-MX',
    sellerRequirements: {
      kycRequired: true,
      taxIdRequired: true, // RFC requerido
      bankAccountRequired: true,
    },
  },
  amazon: {
    name: 'Amazon México',
    logo: '/platforms/amazon.svg',
    color: '#FF9900',
    requirements: {
      imageSize: { width: 1500, height: 1500 },
      titleMaxLength: 200,
      descriptionMaxLength: 2000,
      bulletPointsMax: 5,
      minImages: 1,
      maxImages: 9,
      whiteBackgroundRequired: true,
    },
    fees: {
      commissionRate: 0.15, // 15% para electrónica
      fbaFee: true,
    },
    language: 'es-MX',
  },
};

// Categorías de productos para México
export const mexicoProductCategories = [
  { id: 'tv', name: 'Televisores', icon: 'television', count: 45 },
  { id: 'audio', name: 'Audio', icon: 'speaker-high', count: 23 },
  { id: 'refrigerator', name: 'Refrigeradores', icon: 'fridge', count: 31 },
  { id: 'washing-machine', name: 'Lavadoras', icon: 'washing-machine', count: 28 },
  { id: 'air-conditioner', name: 'Aires Acondicionados', icon: 'snowflake', count: 35 },
  { id: 'vacuum', name: 'Aspiradoras', icon: 'broom', count: 19 },
  { id: 'monitor', name: 'Monitores', icon: 'monitor', count: 37 },
  { id: 'laptop', name: 'Laptops', icon: 'laptop', count: 12 },
];

// Plantilla de ficha técnica para Mercado Libre
export const mercadoLibreSpecificationTemplate = {
  required: [
    { attribute: 'BRAND', label: 'Marca', value: 'LG' },
    { attribute: 'MODEL', label: 'Modelo', value: 'OLED48C5PSA' },
    { attribute: 'SCREEN_SIZE', label: 'Tamaño de la pantalla', value: '48 "' },
    { attribute: 'SCREEN_TYPE', label: 'Tipo de pantalla', value: 'OLED' },
    { attribute: 'RESOLUTION', label: 'Resolución', value: '4K Ultra HD' },
    { attribute: 'SMART_TV', label: 'Es smart TV', value: 'Sí' },
    { attribute: 'REFRESH_RATE', label: 'Frecuencia de actualización', value: '120 Hz' },
  ],
  recommended: [
    { attribute: 'HDR_FORMAT', label: 'Formato HDR', value: 'Dolby Vision, HDR10, HLG' },
    { attribute: 'OPERATING_SYSTEM', label: 'Sistema operativo', value: 'webOS 25' },
    { attribute: 'WIFI', label: 'Conectividad Wi-Fi', value: 'Wi-Fi 6E' },
    { attribute: 'HDMI_PORTS', label: 'Puertos HDMI', value: '4' },
    { attribute: 'USB_PORTS', label: 'Puertos USB', value: '3' },
    { attribute: 'AUDIO_OUTPUT', label: 'Potencia de audio', value: '40 W' },
    { attribute: 'WARRANTY_TIME', label: 'Tiempo de garantía', value: '24 meses' },
    { attribute: 'WARRANTY_TYPE', label: 'Tipo de garantía', value: 'Garantía del vendedor' },
  ],
};

// Guía de optimización para Mercado Libre
export const mercadoLibreOptimizationGuide = {
  title: {
    maxLength: 60,
    format: '[Atributo Principal] + [Marca] + [Modelo] + [Característica Clave]',
    example: 'Smart TV LG OLED Evo 48" 4K 120Hz Gaming C5 Dolby Vision',
    tips: [
      'Incluir tamaño de pantalla en pulgadas',
      'Mencionar resolución (4K)',
      'Destacar tecnología principal (OLED)',
      'Agregar característica diferenciadora',
    ],
  },
  images: {
    mainImage: {
      requirements: 'Fondo blanco puro, producto centrado, sin texto ni logos',
      size: '1200x1200 px mínimo',
    },
    additionalImages: {
      recommended: [
        'Vista frontal',
        'Vista lateral',
        'Vista posterior/puertos',
        'Producto en contexto (lifestyle)',
        'Control remoto incluido',
        'Detalle de características',
      ],
    },
  },
  description: {
    structure: [
      'Título atractivo con beneficio principal',
      'Lista de características principales con bullet points',
      'Tabla de especificaciones técnicas',
      'Información de garantía y envío',
      'Llamada a la acción',
    ],
    keywords: [
      'smart tv', 'oled', '4k', 'gaming', 'dolby vision',
      'netflix', 'garantía', 'envío gratis', 'lg'
    ],
  },
  pricing: {
    competitiveAnalysis: true,
    msrpReference: true,
    promotionalPricing: {
      mercadoCredito: true, // Meses sin intereses
      cupones: true,
    },
  },
};
