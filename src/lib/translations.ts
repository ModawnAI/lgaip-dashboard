/**
 * UI Translations for LGAIP Dashboard
 * Supports German (de), Thai (th), and Spanish (mx) for Mexico
 */

import { CountryCode } from '@/types/product';

// Language mapping based on country code
export const countryToLanguage: Record<CountryCode, 'de' | 'th' | 'es'> = {
  de: 'de',
  uk: 'de', // Default to German for unsupported
  fr: 'de',
  es: 'de',
  it: 'de',
  th: 'th',
  vn: 'de',
  mx: 'es',
  br: 'de',
  kr: 'de',
  jp: 'de',
};

type Language = 'de' | 'th' | 'es';

interface Translations {
  // Pipeline Visualization
  pipeline: {
    title: string;
    subtitle: string;
    startPipeline: string;
    stopPipeline: string;
    resetPipeline: string;
    targetPlatforms: string;
    progress: string;
    completed: string;
    failed: string;
    running: string;
    pending: string;
    steps: {
      assetVerification: {
        name: string;
        description: string;
        agent: string;
      };
      specVerification: {
        name: string;
        description: string;
        agent: string;
      };
      contentGeneration: {
        name: string;
        description: string;
        agent: string;
      };
      platformOptimization: {
        name: string;
        description: string;
        agent: string;
      };
      qualityAssurance: {
        name: string;
        description: string;
        agent: string;
      };
      finalReview: {
        name: string;
        description: string;
        agent: string;
      };
    };
  };
  // Content Editor
  contentEditor: {
    title: string;
    generateAll: string;
    generate: string;
    generating: string;
    regenerate: string;
    preview: string;
    hidePreview: string;
    save: string;
    saved: string;
    saving: string;
    readyToGenerate: string;
    generationError: string;
    tryAgain: string;
    goToPipeline: string;
    generateHtmlFor: string;
    platforms: string;
    selectPlatforms: string;
    noContent: string;
    editContent: string;
    copyContent: string;
    copied: string;
    characterCount: string;
    maxCharacters: string;
    titleLabel: string;
    descriptionLabel: string;
    bulletPointsLabel: string;
    seoLabel: string;
    imagesLabel: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    close: string;
    search: string;
    filter: string;
    all: string;
    none: string;
    select: string;
    selected: string;
    noResults: string;
    retry: string;
  };
  // Product Grid
  productGrid: {
    title: string;
    searchPlaceholder: string;
    filterByCategory: string;
    allCategories: string;
    noProducts: string;
    loadingProducts: string;
    viewDetails: string;
    selectProduct: string;
    price: string;
    rating: string;
    reviews: string;
  };
  // Channel Selector
  channelSelector: {
    title: string;
    subtitle: string;
    d2cChannel: string;
    d2cDescription: string;
    thirdPartyChannel: string;
    thirdPartyDescription: string;
    selectPlatforms: string;
    platformsSelected: string;
    continue: string;
  };
  // Sidebar
  sidebar: {
    dashboard: string;
    countries: string;
    products: string;
    channels: string;
    content: string;
    pipeline: string;
    analytics: string;
    compliance: string;
    settings: string;
    workflowProgress: string;
    country: string;
    product: string;
    channel: string;
    aiContent: string;
    comingSoon: string;
    lgWebsite: string;
  };
  // Header
  header: {
    search: string;
    aiContent: string;
  };
  // Product Detail Modal
  productDetail: {
    overview: string;
    specs: string;
    features: string;
    faq: string;
    metadata: string;
    productDetails: string;
    brand: string;
    modelNumber: string;
    category: string;
    series: string;
    screenSize: string;
    year: string;
    price: string;
    rating: string;
    energyClass: string;
    description: string;
    keySpecifications: string;
    viewAllSpecs: string;
    seoMetadata: string;
    title: string;
    canonical: string;
    energyEfficiency: string;
    scale: string;
    eprelId: string;
    pricing: string;
    currentPrice: string;
    currency: string;
    originalPrice: string;
    rawData: string;
    copyAll: string;
    viewOnLg: string;
    crawled: string;
    images: string;
    close: string;
    selectForGeneration: string;
    noDescription: string;
  };
}

const translations: Record<Language, Translations> = {
  de: {
    pipeline: {
      title: 'Content-Generierungs-Pipeline',
      subtitle: 'Automatisierte Inhaltserstellung für Marktplätze',
      startPipeline: 'Pipeline starten',
      stopPipeline: 'Pipeline stoppen',
      resetPipeline: 'Pipeline zurücksetzen',
      targetPlatforms: 'Zielplattformen',
      progress: 'Fortschritt',
      completed: 'Abgeschlossen',
      failed: 'Fehlgeschlagen',
      running: 'Läuft',
      pending: 'Ausstehend',
      steps: {
        assetVerification: {
          name: 'Asset-Verifizierung',
          description: 'Validierung von Bildern und Medien',
          agent: 'Asset-Verifizierungs-Agent',
        },
        specVerification: {
          name: 'Spezifikations-Verifizierung',
          description: 'Überprüfung der Produktspezifikationen',
          agent: 'Spezifikations-Agent',
        },
        contentGeneration: {
          name: 'Inhaltsgenerierung',
          description: 'Erstellung von Produktbeschreibungen',
          agent: 'Content-Generator-Agent',
        },
        platformOptimization: {
          name: 'Plattform-Optimierung',
          description: 'Anpassung an Plattformanforderungen',
          agent: 'Optimierungs-Agent',
        },
        qualityAssurance: {
          name: 'Qualitätssicherung',
          description: 'Überprüfung auf Compliance und Qualität',
          agent: 'QA-Agent',
        },
        finalReview: {
          name: 'Finale Überprüfung',
          description: 'Letzte Kontrolle vor Veröffentlichung',
          agent: 'Review-Agent',
        },
      },
    },
    contentEditor: {
      title: 'Content-Editor',
      generateAll: 'Alle generieren',
      generate: 'Generieren',
      generating: 'Generiere...',
      regenerate: 'Erneut generieren',
      preview: 'Vorschau anzeigen',
      hidePreview: 'Vorschau ausblenden',
      save: 'Speichern',
      saved: 'Gespeichert',
      saving: 'Speichern...',
      readyToGenerate: 'Bereit zur Generierung',
      generationError: 'Fehler bei der Generierung',
      tryAgain: 'Erneut versuchen',
      goToPipeline: 'Weiter zur Pipeline',
      generateHtmlFor: 'HTML-Inhalte generieren für',
      platforms: 'Plattformen',
      selectPlatforms: 'Plattformen auswählen',
      noContent: 'Kein Inhalt vorhanden',
      editContent: 'Inhalt bearbeiten',
      copyContent: 'Inhalt kopieren',
      copied: 'Kopiert!',
      characterCount: 'Zeichen',
      maxCharacters: 'Max. Zeichen',
      titleLabel: 'Titel',
      descriptionLabel: 'Beschreibung',
      bulletPointsLabel: 'Aufzählungspunkte',
      seoLabel: 'SEO-Daten',
      imagesLabel: 'Bilder',
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      success: 'Erfolgreich',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      back: 'Zurück',
      next: 'Weiter',
      close: 'Schließen',
      search: 'Suchen',
      filter: 'Filtern',
      all: 'Alle',
      none: 'Keine',
      select: 'Auswählen',
      selected: 'ausgewählt',
      noResults: 'Keine Ergebnisse',
      retry: 'Wiederholen',
    },
    productGrid: {
      title: 'Produkte',
      searchPlaceholder: 'Produkte suchen...',
      filterByCategory: 'Nach Kategorie filtern',
      allCategories: 'Alle Kategorien',
      noProducts: 'Keine Produkte gefunden',
      loadingProducts: 'Produkte werden geladen...',
      viewDetails: 'Details anzeigen',
      selectProduct: 'Produkt auswählen',
      price: 'Preis',
      rating: 'Bewertung',
      reviews: 'Bewertungen',
    },
    channelSelector: {
      title: 'Vertriebskanal wählen',
      subtitle: 'Wählen Sie den Kanal für die Content-Generierung',
      d2cChannel: 'D2C Kanal',
      d2cDescription: 'Direkt zum Verbraucher über LG.com',
      thirdPartyChannel: '3P Marktplätze',
      thirdPartyDescription: 'Drittanbieter-Marktplätze',
      selectPlatforms: 'Plattformen auswählen',
      platformsSelected: 'Plattformen ausgewählt',
      continue: 'Weiter',
    },
    sidebar: {
      dashboard: 'Dashboard',
      countries: 'Länder',
      products: 'Produkte',
      channels: 'Kanäle',
      content: 'Inhalte',
      pipeline: 'Pipeline',
      analytics: 'Analysen',
      compliance: 'Compliance',
      settings: 'Einstellungen',
      workflowProgress: 'Workflow-Fortschritt',
      country: 'Land',
      product: 'Produkt',
      channel: 'Kanal',
      aiContent: 'KI-Inhalte',
      comingSoon: 'Bald',
      lgWebsite: 'LG Deutschland Website',
    },
    header: {
      search: 'Suchen...',
      aiContent: 'KI-Inhalte',
    },
    productDetail: {
      overview: 'Übersicht',
      specs: 'Spezifikationen',
      features: 'Funktionen',
      faq: 'FAQ',
      metadata: 'Metadaten',
      productDetails: 'Produktdetails',
      brand: 'Marke',
      modelNumber: 'Modellnummer',
      category: 'Kategorie',
      series: 'Serie',
      screenSize: 'Bildschirmgröße',
      year: 'Jahr',
      price: 'Preis',
      rating: 'Bewertung',
      energyClass: 'Energieklasse',
      description: 'Beschreibung',
      keySpecifications: 'Wichtige Spezifikationen',
      viewAllSpecs: 'Alle Spezifikationen anzeigen',
      seoMetadata: 'SEO-Metadaten',
      title: 'Titel',
      canonical: 'Kanonische URL',
      energyEfficiency: 'Energieeffizienz',
      scale: 'Skala',
      eprelId: 'EPREL ID',
      pricing: 'Preisgestaltung',
      currentPrice: 'Aktueller Preis',
      currency: 'Währung',
      originalPrice: 'Originalpreis',
      rawData: 'Rohdaten',
      copyAll: 'Alles kopieren',
      viewOnLg: 'Auf LG.com ansehen',
      crawled: 'Erfasst',
      images: 'Bilder',
      close: 'Schließen',
      selectForGeneration: 'Für Content-Generierung auswählen',
      noDescription: 'Keine Beschreibung verfügbar.',
    },
  },
  th: {
    pipeline: {
      title: 'ไปป์ไลน์สร้างเนื้อหา',
      subtitle: 'การสร้างเนื้อหาอัตโนมัติสำหรับมาร์เก็ตเพลส',
      startPipeline: 'เริ่มไปป์ไลน์',
      stopPipeline: 'หยุดไปป์ไลน์',
      resetPipeline: 'รีเซ็ตไปป์ไลน์',
      targetPlatforms: 'แพลตฟอร์มเป้าหมาย',
      progress: 'ความคืบหน้า',
      completed: 'เสร็จสิ้น',
      failed: 'ล้มเหลว',
      running: 'กำลังทำงาน',
      pending: 'รอดำเนินการ',
      steps: {
        assetVerification: {
          name: 'ตรวจสอบรูปภาพ',
          description: 'ตรวจสอบความถูกต้องของรูปภาพและสื่อ',
          agent: 'เอเจนต์ตรวจสอบสินทรัพย์',
        },
        specVerification: {
          name: 'ตรวจสอบสเปค',
          description: 'ตรวจสอบข้อมูลจำเพาะของผลิตภัณฑ์',
          agent: 'เอเจนต์ตรวจสอบสเปค',
        },
        contentGeneration: {
          name: 'สร้างคำอธิบาย',
          description: 'สร้างคำอธิบายสินค้า',
          agent: 'เอเจนต์สร้างเนื้อหา',
        },
        platformOptimization: {
          name: 'ปรับแต่งแพลตฟอร์ม',
          description: 'ปรับให้เหมาะกับข้อกำหนดแพลตฟอร์ม',
          agent: 'เอเจนต์ปรับแต่ง',
        },
        qualityAssurance: {
          name: 'ตรวจสอบคุณภาพ',
          description: 'ตรวจสอบความสอดคล้องและคุณภาพ',
          agent: 'เอเจนต์ QA',
        },
        finalReview: {
          name: 'ตรวจสอบขั้นสุดท้าย',
          description: 'ตรวจสอบครั้งสุดท้ายก่อนเผยแพร่',
          agent: 'เอเจนต์ตรวจสอบ',
        },
      },
    },
    contentEditor: {
      title: 'แก้ไขเนื้อหา',
      generateAll: 'สร้างทั้งหมด',
      generate: 'สร้าง',
      generating: 'กำลังสร้าง...',
      regenerate: 'สร้างใหม่',
      preview: 'ดูตัวอย่าง',
      hidePreview: 'ซ่อนตัวอย่าง',
      save: 'บันทึก',
      saved: 'บันทึกแล้ว',
      saving: 'กำลังบันทึก...',
      readyToGenerate: 'พร้อมสร้างเนื้อหา',
      generationError: 'เกิดข้อผิดพลาดในการสร้าง',
      tryAgain: 'ลองอีกครั้ง',
      goToPipeline: 'ไปยังไปป์ไลน์',
      generateHtmlFor: 'สร้างเนื้อหา HTML สำหรับ',
      platforms: 'แพลตฟอร์ม',
      selectPlatforms: 'เลือกแพลตฟอร์ม',
      noContent: 'ไม่มีเนื้อหา',
      editContent: 'แก้ไขเนื้อหา',
      copyContent: 'คัดลอกเนื้อหา',
      copied: 'คัดลอกแล้ว!',
      characterCount: 'ตัวอักษร',
      maxCharacters: 'ตัวอักษรสูงสุด',
      titleLabel: 'ชื่อ',
      descriptionLabel: 'คำอธิบาย',
      bulletPointsLabel: 'รายการจุดเด่น',
      seoLabel: 'ข้อมูล SEO',
      imagesLabel: 'รูปภาพ',
    },
    common: {
      loading: 'กำลังโหลด...',
      error: 'ข้อผิดพลาด',
      success: 'สำเร็จ',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      back: 'ย้อนกลับ',
      next: 'ถัดไป',
      close: 'ปิด',
      search: 'ค้นหา',
      filter: 'กรอง',
      all: 'ทั้งหมด',
      none: 'ไม่มี',
      select: 'เลือก',
      selected: 'เลือกแล้ว',
      noResults: 'ไม่พบผลลัพธ์',
      retry: 'ลองใหม่',
    },
    productGrid: {
      title: 'สินค้า',
      searchPlaceholder: 'ค้นหาสินค้า...',
      filterByCategory: 'กรองตามหมวดหมู่',
      allCategories: 'ทุกหมวดหมู่',
      noProducts: 'ไม่พบสินค้า',
      loadingProducts: 'กำลังโหลดสินค้า...',
      viewDetails: 'ดูรายละเอียด',
      selectProduct: 'เลือกสินค้า',
      price: 'ราคา',
      rating: 'คะแนน',
      reviews: 'รีวิว',
    },
    channelSelector: {
      title: 'เลือกช่องทางการขาย',
      subtitle: 'เลือกช่องทางสำหรับสร้างเนื้อหา',
      d2cChannel: 'ช่องทาง D2C',
      d2cDescription: 'ขายตรงผ่าน LG.com',
      thirdPartyChannel: 'มาร์เก็ตเพลส',
      thirdPartyDescription: 'แพลตฟอร์มมาร์เก็ตเพลสบุคคลที่สาม',
      selectPlatforms: 'เลือกแพลตฟอร์ม',
      platformsSelected: 'แพลตฟอร์มที่เลือก',
      continue: 'ดำเนินการต่อ',
    },
    sidebar: {
      dashboard: 'แดชบอร์ด',
      countries: 'ประเทศ',
      products: 'สินค้า',
      channels: 'ช่องทาง',
      content: 'เนื้อหา',
      pipeline: 'ไปป์ไลน์',
      analytics: 'การวิเคราะห์',
      compliance: 'การปฏิบัติตาม',
      settings: 'การตั้งค่า',
      workflowProgress: 'ความคืบหน้าการทำงาน',
      country: 'ประเทศ',
      product: 'สินค้า',
      channel: 'ช่องทาง',
      aiContent: 'เนื้อหา AI',
      comingSoon: 'เร็วๆ นี้',
      lgWebsite: 'เว็บไซต์ LG ประเทศไทย',
    },
    header: {
      search: 'ค้นหา...',
      aiContent: 'เนื้อหา AI',
    },
    productDetail: {
      overview: 'ภาพรวม',
      specs: 'สเปค',
      features: 'คุณสมบัติ',
      faq: 'คำถามที่พบบ่อย',
      metadata: 'เมตาดาต้า',
      productDetails: 'รายละเอียดสินค้า',
      brand: 'แบรนด์',
      modelNumber: 'หมายเลขรุ่น',
      category: 'หมวดหมู่',
      series: 'ซีรี่ส์',
      screenSize: 'ขนาดหน้าจอ',
      year: 'ปี',
      price: 'ราคา',
      rating: 'คะแนน',
      energyClass: 'ระดับพลังงาน',
      description: 'คำอธิบาย',
      keySpecifications: 'สเปคสำคัญ',
      viewAllSpecs: 'ดูสเปคทั้งหมด',
      seoMetadata: 'เมตาดาต้า SEO',
      title: 'ชื่อ',
      canonical: 'URL มาตรฐาน',
      energyEfficiency: 'ประสิทธิภาพพลังงาน',
      scale: 'มาตราส่วน',
      eprelId: 'EPREL ID',
      pricing: 'ราคา',
      currentPrice: 'ราคาปัจจุบัน',
      currency: 'สกุลเงิน',
      originalPrice: 'ราคาเดิม',
      rawData: 'ข้อมูลดิบ',
      copyAll: 'คัดลอกทั้งหมด',
      viewOnLg: 'ดูบน LG.com',
      crawled: 'รวบรวมเมื่อ',
      images: 'รูปภาพ',
      close: 'ปิด',
      selectForGeneration: 'เลือกเพื่อสร้างเนื้อหา',
      noDescription: 'ไม่มีคำอธิบาย',
    },
  },
  es: {
    pipeline: {
      title: 'Pipeline de Generación de Contenido',
      subtitle: 'Creación automatizada de contenido para marketplaces',
      startPipeline: 'Iniciar Pipeline',
      stopPipeline: 'Detener Pipeline',
      resetPipeline: 'Reiniciar Pipeline',
      targetPlatforms: 'Plataformas Objetivo',
      progress: 'Progreso',
      completed: 'Completado',
      failed: 'Fallido',
      running: 'En ejecución',
      pending: 'Pendiente',
      steps: {
        assetVerification: {
          name: 'Verificación de Imágenes',
          description: 'Validando imágenes y medios',
          agent: 'Agente de Verificación de Activos',
        },
        specVerification: {
          name: 'Verificación de Especificaciones',
          description: 'Verificando especificaciones del producto',
          agent: 'Agente de Especificaciones',
        },
        contentGeneration: {
          name: 'Generación de Contenido',
          description: 'Creando descripciones del producto',
          agent: 'Agente Generador de Contenido',
        },
        platformOptimization: {
          name: 'Optimización de Plataforma',
          description: 'Adaptando a requisitos de la plataforma',
          agent: 'Agente de Optimización',
        },
        qualityAssurance: {
          name: 'Control de Calidad',
          description: 'Verificando cumplimiento y calidad',
          agent: 'Agente de QA',
        },
        finalReview: {
          name: 'Revisión Final',
          description: 'Última verificación antes de publicar',
          agent: 'Agente de Revisión',
        },
      },
    },
    contentEditor: {
      title: 'Editor de Contenido',
      generateAll: 'Generar Todo',
      generate: 'Generar',
      generating: 'Generando...',
      regenerate: 'Regenerar',
      preview: 'Ver Vista Previa',
      hidePreview: 'Ocultar Vista Previa',
      save: 'Guardar',
      saved: 'Guardado',
      saving: 'Guardando...',
      readyToGenerate: 'Listo para Generar',
      generationError: 'Error en la Generación',
      tryAgain: 'Intentar de Nuevo',
      goToPipeline: 'Ir al Pipeline',
      generateHtmlFor: 'Generar contenido HTML para',
      platforms: 'Plataformas',
      selectPlatforms: 'Seleccionar Plataformas',
      noContent: 'Sin Contenido',
      editContent: 'Editar Contenido',
      copyContent: 'Copiar Contenido',
      copied: '¡Copiado!',
      characterCount: 'Caracteres',
      maxCharacters: 'Máx. Caracteres',
      titleLabel: 'Título',
      descriptionLabel: 'Descripción',
      bulletPointsLabel: 'Viñetas',
      seoLabel: 'Datos SEO',
      imagesLabel: 'Imágenes',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      close: 'Cerrar',
      search: 'Buscar',
      filter: 'Filtrar',
      all: 'Todos',
      none: 'Ninguno',
      select: 'Seleccionar',
      selected: 'seleccionado',
      noResults: 'Sin Resultados',
      retry: 'Reintentar',
    },
    productGrid: {
      title: 'Productos',
      searchPlaceholder: 'Buscar productos...',
      filterByCategory: 'Filtrar por Categoría',
      allCategories: 'Todas las Categorías',
      noProducts: 'No se encontraron productos',
      loadingProducts: 'Cargando productos...',
      viewDetails: 'Ver Detalles',
      selectProduct: 'Seleccionar Producto',
      price: 'Precio',
      rating: 'Calificación',
      reviews: 'Reseñas',
    },
    channelSelector: {
      title: 'Seleccionar Canal de Venta',
      subtitle: 'Elija el canal para la generación de contenido',
      d2cChannel: 'Canal D2C',
      d2cDescription: 'Directo al consumidor a través de LG.com',
      thirdPartyChannel: 'Marketplaces',
      thirdPartyDescription: 'Plataformas de terceros',
      selectPlatforms: 'Seleccionar Plataformas',
      platformsSelected: 'Plataformas seleccionadas',
      continue: 'Continuar',
    },
    sidebar: {
      dashboard: 'Panel',
      countries: 'Países',
      products: 'Productos',
      channels: 'Canales',
      content: 'Contenido',
      pipeline: 'Pipeline',
      analytics: 'Análisis',
      compliance: 'Cumplimiento',
      settings: 'Configuración',
      workflowProgress: 'Progreso del Flujo',
      country: 'País',
      product: 'Producto',
      channel: 'Canal',
      aiContent: 'Contenido IA',
      comingSoon: 'Pronto',
      lgWebsite: 'Sitio Web de LG México',
    },
    header: {
      search: 'Buscar...',
      aiContent: 'Contenido IA',
    },
    productDetail: {
      overview: 'Resumen',
      specs: 'Especificaciones',
      features: 'Características',
      faq: 'Preguntas Frecuentes',
      metadata: 'Metadatos',
      productDetails: 'Detalles del Producto',
      brand: 'Marca',
      modelNumber: 'Número de Modelo',
      category: 'Categoría',
      series: 'Serie',
      screenSize: 'Tamaño de Pantalla',
      year: 'Año',
      price: 'Precio',
      rating: 'Calificación',
      energyClass: 'Clase de Energía',
      description: 'Descripción',
      keySpecifications: 'Especificaciones Clave',
      viewAllSpecs: 'Ver todas las especificaciones',
      seoMetadata: 'Metadatos SEO',
      title: 'Título',
      canonical: 'URL Canónica',
      energyEfficiency: 'Eficiencia Energética',
      scale: 'Escala',
      eprelId: 'ID EPREL',
      pricing: 'Precios',
      currentPrice: 'Precio Actual',
      currency: 'Moneda',
      originalPrice: 'Precio Original',
      rawData: 'Datos Sin Procesar',
      copyAll: 'Copiar Todo',
      viewOnLg: 'Ver en LG.com',
      crawled: 'Recopilado',
      images: 'Imágenes',
      close: 'Cerrar',
      selectForGeneration: 'Seleccionar para Generación de Contenido',
      noDescription: 'No hay descripción disponible.',
    },
  },
};

/**
 * Get translations for a specific country
 */
export function getTranslations(country: CountryCode | null): Translations {
  if (!country) return translations.de;
  const language = countryToLanguage[country] || 'de';
  return translations[language];
}

/**
 * Hook-like function to get translation function
 */
export function useTranslation(country: CountryCode | null) {
  const t = getTranslations(country);
  return { t, language: country ? countryToLanguage[country] : 'de' };
}

export type { Translations, Language };
export { translations };
