/**
 * HTML Templates for Product Listing Content Generation
 * These templates are used to generate styled HTML sections that can be
 * combined and exported as PNG images for marketplace uploads.
 *
 * Optimized for eBay best practices:
 * - Simple, consistent formatting (one typeface, 14pt black font)
 * - Mobile-responsive design (80%+ mobile buyers)
 * - Minimal HTML, no external links
 * - Clean visual hierarchy
 *
 * Language agnostic - supports de, en, es, th locales
 */

export type SupportedLocale = 'de' | 'en' | 'es' | 'th';

export interface ProductImage {
  src: string;
  alt?: string;
  type?: 'main' | 'gallery' | 'lifestyle' | 'feature';
}

export interface ProductData {
  title: string;
  modelNumber: string;
  categoryName?: string;
  description?: string;
  mainImage?: ProductImage;
  galleryImages?: ProductImage[];
  lifestyleImages?: ProductImage[];
  rawData?: {
    features?: string[];
    specifications?: Record<string, string | number>;
    usps?: Array<{ headline: string; description: string; icon?: string }>;
  };
}

export interface GeneratedHtmlContent {
  heroSection: string;
  featuresSection: string;
  specificationsSection: string;
  benefitsSection: string;
  warrantySection: string;
  gallerySection: string;
  fullTemplate: string;
}

// Phosphor Icon SVGs (inline for email/marketplace compatibility)
const PhosphorIcons = {
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  lightning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17Z"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.54-41.28L186,58.84a88.08,88.08,0,1,0,26.67,38,8,8,0,0,1,9.2-13.72Z"/></svg>`,
  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M208,144a15.78,15.78,0,0,1-10.42,14.94l-51.65,19-19,51.65a15.92,15.92,0,0,1-29.88,0l-19-51.65-51.65-19a15.92,15.92,0,0,1,0-29.88l51.65-19,19-51.65a15.92,15.92,0,0,1,29.88,0l19,51.65,51.65,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-30.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  gem: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M248,96a8,8,0,0,0-3.72-6.76l-52-36A8,8,0,0,0,188,52H68a8,8,0,0,0-4.28,1.24l-52,36a8,8,0,0,0-.57,13.27l108,88a8,8,0,0,0,10.1.14l108-88A8,8,0,0,0,248,96Z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51.07,31a16,16,0,0,1-23.84-17.34l13.49-58.54-45.11-39.42a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"/></svg>`,
  coin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M207.58,63.84C186.85,53.48,159.33,48,128,48S69.15,53.48,48.42,63.84,16,88.78,16,104v48c0,15.22,11.82,29.85,32.42,40.16S96.67,208,128,208s58.85-5.48,79.58-15.84S240,167.22,240,152V104C240,88.78,228.18,74.15,207.58,63.84Z"/></svg>`,
  speakerLow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M163.51,24.81a8,8,0,0,0-8.42.88L85.25,80H40A16,16,0,0,0,24,96v64a16,16,0,0,0,16,16H85.25l69.84,54.31A8,8,0,0,0,168,224V32A8,8,0,0,0,163.51,24.81ZM200,104v48a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>`,
  smartphone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM128,216a12,12,0,1,1,12-12A12,12,0,0,1,128,216Z"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M247.42,117.14l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117.14ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm112,0a16,16,0,1,1,16-16A16,16,0,0,1,184,208Z"/></svg>`,
  wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96a72.34,72.34,0,0,0,5.17,26.8L39.49,176.48A32,32,0,0,0,84.72,221.71l53.68-53.68A72,72,0,0,0,226.76,69Z"/></svg>`,
  certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,136a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h48A8,8,0,0,1,128,136Zm-8-40H72a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm112,65.47V224a8,8,0,0,1-12,7l-20-11.43L180,231a8,8,0,0,1-12-7V200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216a16,16,0,0,1,16,16v33.47a52,52,0,0,1,0,72Z"/></svg>`,
  listChecks: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Zm-96-56h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"/></svg>`,
  shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-30.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15Z"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-26.37,144H154.37A143.68,143.68,0,0,1,128,207.54,143.68,143.68,0,0,1,101.63,168ZM96.44,152a163.69,163.69,0,0,1,0-48h63.12a163.69,163.69,0,0,1,0,48Z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"/></svg>`,
  cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M152,96H104a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V104A8,8,0,0,0,152,96Zm88,56a8,8,0,0,1-8,8H216v16a24,24,0,0,1-24,24H176v16a8,8,0,0,1-16,0V216H144v16a8,8,0,0,1-16,0V216H96v16a8,8,0,0,1-16,0V216H64a24,24,0,0,1-24-24V176H24a8,8,0,0,1,0-16H40V144H24a8,8,0,0,1,0-16H40V96H24a8,8,0,0,1,0-16H40V64A24,24,0,0,1,64,40H80V24a8,8,0,0,1,16,0V40h32V24a8,8,0,0,1,16,0V40h16V24a8,8,0,0,1,16,0V40h16a24,24,0,0,1,24,24V80h16a8,8,0,0,1,0,16H216v16h16a8,8,0,0,1,0,16H216v16h16A8,8,0,0,1,240,152Z"/></svg>`,
};

// Map icon names to Phosphor SVGs
function getIconSvg(iconName: string, size: number = 20, color: string = 'currentColor'): string {
  const icons: Record<string, string> = {
    check: PhosphorIcons.check,
    checkCircle: PhosphorIcons.checkCircle,
    lightning: PhosphorIcons.lightning,
    target: PhosphorIcons.target,
    sparkle: PhosphorIcons.sparkle,
    shield: PhosphorIcons.shield,
    gem: PhosphorIcons.gem,
    star: PhosphorIcons.star,
    coin: PhosphorIcons.coin,
    speakerLow: PhosphorIcons.speakerLow,
    smartphone: PhosphorIcons.smartphone,
    truck: PhosphorIcons.truck,
    wrench: PhosphorIcons.wrench,
    certificate: PhosphorIcons.certificate,
    listChecks: PhosphorIcons.listChecks,
    shieldCheck: PhosphorIcons.shieldCheck,
    package: PhosphorIcons.package,
    globe: PhosphorIcons.globe,
    heart: PhosphorIcons.heart,
    cpu: PhosphorIcons.cpu,
  };

  const svg = icons[iconName] || icons.star;
  return svg.replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`);
}

// Feature icons mapped by index (no emojis)
const featureIconNames = ['lightning', 'target', 'sparkle', 'shield', 'gem', 'star'];

// Localization strings
const i18n: Record<SupportedLocale, Record<string, string>> = {
  de: {
    officialPartner: 'Offizieller LG Partner',
    model: 'Modell',
    premiumQuality: 'Premium-Qualit\u00e4t von LG Electronics',
    warranty2Year: '2 Jahre Garantie',
    freeShipping: 'Kostenloser Versand',
    keyFeatures: 'Hauptmerkmale',
    technicalSpecs: 'Technische Daten',
    whyChooseLG: 'Warum LG w\u00e4hlen?',
    energyEfficient: 'Energieeffizient',
    energySaveDesc: 'Sparen Sie bis zu 30% Stromkosten',
    whisperQuiet: 'Fl\u00fcsterleise',
    quietDesc: 'Genie\u00dfen Sie Ruhe und Komfort',
    smartHome: 'Smart Home Ready',
    smartDesc: 'Kompatibel mit Google Home & Alexa',
    durable: 'Langlebig',
    durableDesc: 'Premium-Qualit\u00e4t f\u00fcr jahrelangen Einsatz',
    warrantyTitle: '2 Jahre Herstellergarantie',
    warrantyDesc: 'Ihr Kauf ist durch die offizielle LG Herstellergarantie abgesichert. Bei Fragen oder Problemen steht Ihnen unser Kundenservice zur Verf\u00fcgung.',
    freeRepairs: 'Kostenlose Reparatur',
    genuineParts: 'Original LG Ersatzteile',
    nationwideService: 'Landesweiter Service',
    feature: 'Feature',
  },
  en: {
    officialPartner: 'Official LG Partner',
    model: 'Model',
    premiumQuality: 'Premium quality from LG Electronics',
    warranty2Year: '2 Year Warranty',
    freeShipping: 'Free Shipping',
    keyFeatures: 'Key Features',
    technicalSpecs: 'Technical Specifications',
    whyChooseLG: 'Why Choose LG?',
    energyEfficient: 'Energy Efficient',
    energySaveDesc: 'Save up to 30% on electricity',
    whisperQuiet: 'Whisper Quiet',
    quietDesc: 'Enjoy peace and comfort',
    smartHome: 'Smart Home Ready',
    smartDesc: 'Compatible with Google Home & Alexa',
    durable: 'Long-lasting',
    durableDesc: 'Premium quality for years of use',
    warrantyTitle: '2 Year Manufacturer Warranty',
    warrantyDesc: 'Your purchase is protected by official LG manufacturer warranty. Our customer service team is available to assist you.',
    freeRepairs: 'Free Repairs',
    genuineParts: 'Genuine LG Parts',
    nationwideService: 'Nationwide Service',
    feature: 'Feature',
  },
  es: {
    officialPartner: 'Distribuidor Oficial LG',
    model: 'Modelo',
    premiumQuality: 'Calidad premium de LG Electronics',
    warranty2Year: '2 A\u00f1os de Garant\u00eda',
    freeShipping: 'Env\u00edo Gratis',
    keyFeatures: 'Caracter\u00edsticas Principales',
    technicalSpecs: 'Especificaciones T\u00e9cnicas',
    whyChooseLG: '\u00bfPor qu\u00e9 elegir LG?',
    energyEfficient: 'Eficiencia Energ\u00e9tica',
    energySaveDesc: 'Ahorra hasta 30% en electricidad',
    whisperQuiet: 'Ultra Silencioso',
    quietDesc: 'Disfruta de paz y comodidad',
    smartHome: 'Smart Home Ready',
    smartDesc: 'Compatible con Google Home y Alexa',
    durable: 'Durabilidad',
    durableDesc: 'Calidad premium para a\u00f1os de uso',
    warrantyTitle: '2 A\u00f1os de Garant\u00eda del Fabricante',
    warrantyDesc: 'Su compra est\u00e1 protegida por la garant\u00eda oficial de LG. Nuestro equipo de servicio al cliente est\u00e1 disponible para ayudarle.',
    freeRepairs: 'Reparaciones Gratis',
    genuineParts: 'Partes Originales LG',
    nationwideService: 'Servicio Nacional',
    feature: 'Caracter\u00edstica',
  },
  th: {
    officialPartner: '\u0e15\u0e31\u0e27\u0e41\u0e17\u0e19\u0e08\u0e33\u0e2b\u0e19\u0e48\u0e32\u0e22\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e40\u0e1b\u0e47\u0e19\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23 LG',
    model: '\u0e23\u0e38\u0e48\u0e19',
    premiumQuality: '\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e1e\u0e23\u0e35\u0e40\u0e21\u0e35\u0e22\u0e21\u0e08\u0e32\u0e01 LG Electronics',
    warranty2Year: '\u0e23\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19 2 \u0e1b\u0e35',
    freeShipping: '\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07\u0e1f\u0e23\u0e35',
    keyFeatures: '\u0e04\u0e38\u0e13\u0e2a\u0e21\u0e1a\u0e31\u0e15\u0e34\u0e40\u0e14\u0e48\u0e19',
    technicalSpecs: '\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e08\u0e33\u0e40\u0e1e\u0e32\u0e30\u0e17\u0e32\u0e07\u0e40\u0e17\u0e04\u0e19\u0e34\u0e04',
    whyChooseLG: '\u0e17\u0e33\u0e44\u0e21\u0e15\u0e49\u0e2d\u0e07\u0e40\u0e25\u0e37\u0e2d\u0e01 LG?',
    energyEfficient: '\u0e1b\u0e23\u0e30\u0e2b\u0e22\u0e31\u0e14\u0e1e\u0e25\u0e31\u0e07\u0e07\u0e32\u0e19',
    energySaveDesc: '\u0e1b\u0e23\u0e30\u0e2b\u0e22\u0e31\u0e14\u0e04\u0e48\u0e32\u0e44\u0e1f\u0e1f\u0e49\u0e32\u0e44\u0e14\u0e49\u0e16\u0e36\u0e07 30%',
    whisperQuiet: '\u0e40\u0e07\u0e35\u0e22\u0e1a\u0e40\u0e07\u0e35\u0e22\u0e1a',
    quietDesc: '\u0e40\u0e1e\u0e25\u0e34\u0e14\u0e40\u0e1e\u0e25\u0e34\u0e19\u0e01\u0e31\u0e1a\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e30\u0e14\u0e27\u0e01\u0e2a\u0e1a\u0e32\u0e22',
    smartHome: '\u0e23\u0e2d\u0e07\u0e23\u0e31\u0e1a Smart Home',
    smartDesc: '\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e23\u0e48\u0e27\u0e21\u0e01\u0e31\u0e1a Google Home \u0e41\u0e25\u0e30 Alexa',
    durable: '\u0e17\u0e19\u0e17\u0e32\u0e19',
    durableDesc: '\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e1e\u0e23\u0e35\u0e40\u0e21\u0e35\u0e22\u0e21\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e22\u0e32\u0e27\u0e19\u0e32\u0e19',
    warrantyTitle: '\u0e23\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19\u0e08\u0e32\u0e01\u0e1c\u0e39\u0e49\u0e1c\u0e25\u0e34\u0e15 2 \u0e1b\u0e35',
    warrantyDesc: '\u0e01\u0e32\u0e23\u0e0b\u0e37\u0e49\u0e2d\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e04\u0e38\u0e49\u0e21\u0e04\u0e23\u0e2d\u0e07\u0e42\u0e14\u0e22\u0e01\u0e32\u0e23\u0e23\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e40\u0e1b\u0e47\u0e19\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e02\u0e2d\u0e07 LG \u0e17\u0e35\u0e21\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e2b\u0e49\u0e04\u0e27\u0e32\u0e21\u0e0a\u0e48\u0e27\u0e22\u0e40\u0e2b\u0e25\u0e37\u0e2d',
    freeRepairs: '\u0e0b\u0e48\u0e2d\u0e21\u0e1f\u0e23\u0e35',
    genuineParts: '\u0e2d\u0e30\u0e44\u0e2b\u0e25\u0e48\u0e41\u0e17\u0e49 LG',
    nationwideService: '\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e17\u0e31\u0e48\u0e27\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28',
    feature: '\u0e04\u0e38\u0e13\u0e2a\u0e21\u0e1a\u0e31\u0e15\u0e34',
  },
};

// LG Brand Colors - consistent across all platforms
const LG_BRAND = {
  primary: '#A50034', // LG Red
  dark: '#1A1A1A',
  gray: '#6B6B6B',
  lightGray: '#F5F5F5',
  white: '#FFFFFF',
};

// Platform-specific brand colors and styles
const platformStyles: Record<string, {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: string;
  locale: SupportedLocale;
}> = {
  mediamarkt: {
    primaryColor: '#df0000',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '0px',
    buttonStyle: 'background: #df0000; color: white; font-weight: bold; text-transform: uppercase;',
    locale: 'de',
  },
  saturn: {
    primaryColor: '#f79422',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '4px',
    buttonStyle: 'background: #f79422; color: white; font-weight: bold;',
    locale: 'de',
  },
  amazon: {
    primaryColor: '#ff9900',
    secondaryColor: '#232f3e',
    accentColor: '#146eb4',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '8px',
    buttonStyle: 'background: linear-gradient(to bottom, #f7dfa5, #f0c14b); color: #111; border: 1px solid #a88734;',
    locale: 'de',
  },
  otto: {
    primaryColor: '#e63312',
    secondaryColor: '#ffffff',
    accentColor: '#333333',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '4px',
    buttonStyle: 'background: #e63312; color: white; font-weight: 600;',
    locale: 'de',
  },
  galaxus: {
    primaryColor: '#0066cc',
    secondaryColor: '#f5f5f5',
    accentColor: '#333333',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '4px',
    buttonStyle: 'background: #0066cc; color: white;',
    locale: 'de',
  },
  kaufland: {
    primaryColor: '#e10915',
    secondaryColor: '#ffffff',
    accentColor: '#1a1a1a',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '0px',
    buttonStyle: 'background: #e10915; color: white; font-weight: bold;',
    locale: 'de',
  },
  ebay: {
    primaryColor: '#0064d2',
    secondaryColor: '#ffffff',
    accentColor: '#e53238',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '8px',
    buttonStyle: 'background: #0064d2; color: white; border-radius: 8px;',
    locale: 'de',
  },
  shopee: {
    primaryColor: '#ee4d2d',
    secondaryColor: '#ffffff',
    accentColor: '#222222',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '4px',
    buttonStyle: 'background: #ee4d2d; color: white;',
    locale: 'th',
  },
  lazada: {
    primaryColor: '#0f146d',
    secondaryColor: '#f57224',
    accentColor: '#ffffff',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '4px',
    buttonStyle: 'background: #f57224; color: white; font-weight: bold;',
    locale: 'th',
  },
  tiktok: {
    primaryColor: '#000000',
    secondaryColor: '#fe2c55',
    accentColor: '#25f4ee',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '8px',
    buttonStyle: 'background: #fe2c55; color: white; font-weight: bold;',
    locale: 'th',
  },
  mercadolibre: {
    primaryColor: '#FFE600',
    secondaryColor: '#3483FA',
    accentColor: '#333333',
    fontFamily: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '6px',
    buttonStyle: 'background: #3483FA; color: white; font-weight: bold;',
    locale: 'es',
  },
};

// Get styles for a platform with fallback
function getStyles(platform: string) {
  return platformStyles[platform.toLowerCase()] || platformStyles.amazon;
}

// Get locale from platform or use override
function getLocale(platform: string, localeOverride?: SupportedLocale): SupportedLocale {
  if (localeOverride) return localeOverride;
  const styles = getStyles(platform);
  return styles.locale || 'en';
}

// Get translation string
function t(locale: SupportedLocale, key: string): string {
  return i18n[locale]?.[key] || i18n.en[key] || key;
}

/**
 * Generate Hero Section HTML
 * Layout: IMAGE-FIRST - Large image on top, title/description below
 * Optimized for eBay mobile-first (80%+ mobile buyers)
 * Uses LG brand colors with platform accent
 */
export function generateHeroSection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);
  const currentLocale = getLocale(platform, locale);
  // eBay best practice: 80 char max title
  const truncatedTitle = product.title.substring(0, 80);

  return `
<div style="
  width: 800px;
  max-width: 100%;
  background: ${LG_BRAND.white};
  padding: 32px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
  border: 1px solid ${LG_BRAND.lightGray};
">
  <!-- IMAGE FIRST: Large product image at top -->
  <div style="
    width: 100%;
    max-width: 600px;
    margin: 0 auto 24px auto;
    background: ${LG_BRAND.lightGray};
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    ${product.mainImage?.src
      ? `<img src="${product.mainImage.src}" alt="${product.mainImage.alt || product.title}" style="width: 100%; height: 100%; object-fit: contain;" />`
      : `<div style="color: ${LG_BRAND.gray};">${getIconSvg('package', 80)}</div>`
    }
  </div>

  <!-- Title and description below image -->
  <div style="text-align: center;">
    <div style="
      display: inline-block;
      background: ${LG_BRAND.primary};
      color: white;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 4px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    ">
      ${t(currentLocale, 'officialPartner')}
    </div>
    <h1 style="
      font-size: 24px;
      font-weight: 700;
      color: ${LG_BRAND.dark};
      margin: 0 0 12px 0;
      line-height: 1.3;
      letter-spacing: -0.02em;
    ">
      ${truncatedTitle}
    </h1>
    <p style="
      font-size: 14px;
      color: ${LG_BRAND.gray};
      margin: 0 0 8px 0;
    ">
      ${t(currentLocale, 'model')}: ${product.modelNumber}
    </p>
    <p style="
      font-size: 14px;
      color: ${LG_BRAND.dark};
      margin: 0 0 20px 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    ">
      ${product.description?.slice(0, 200) || t(currentLocale, 'premiumQuality')}
    </p>
    <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #e8f5e9;
        color: #2e7d32;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
      ">
        ${getIconSvg('shieldCheck', 16)}
        ${t(currentLocale, 'warranty2Year')}
      </span>
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #e3f2fd;
        color: #1565c0;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
      ">
        ${getIconSvg('truck', 16)}
        ${t(currentLocale, 'freeShipping')}
      </span>
    </div>
  </div>
</div>`;
}

/**
 * Generate Features Section HTML
 * Layout: Clean list with numbered items and checkmark icons
 * Different from Hero (split view) and Specs (table)
 */
export function generateFeaturesSection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);
  const features = product.rawData?.features || [];
  const currentLocale = getLocale(platform, locale);

  return `
<div style="
  width: 800px;
  background: ${LG_BRAND.lightGray};
  padding: 40px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
">
  <div style="
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  ">
    <div style="
      width: 36px;
      height: 36px;
      background: ${LG_BRAND.primary};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      ${getIconSvg('listChecks', 20)}
    </div>
    <h2 style="
      font-size: 22px;
      font-weight: 700;
      color: ${LG_BRAND.dark};
      margin: 0;
      letter-spacing: -0.02em;
    ">
      ${t(currentLocale, 'keyFeatures')}
    </h2>
  </div>
  <div style="
    background: ${LG_BRAND.white};
    border-radius: 8px;
    padding: 8px 0;
  ">
    ${features.slice(0, 6).map((feature, idx) => `
      <div style="
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 20px;
        ${idx < Math.min(features.length, 6) - 1 ? `border-bottom: 1px solid ${LG_BRAND.lightGray};` : ''}
      ">
        <div style="
          width: 28px;
          height: 28px;
          background: ${LG_BRAND.primary}15;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${LG_BRAND.primary};
          flex-shrink: 0;
          margin-top: 2px;
        ">
          ${getIconSvg(featureIconNames[idx % featureIconNames.length], 16)}
        </div>
        <p style="
          font-size: 14px;
          color: ${LG_BRAND.dark};
          margin: 0;
          line-height: 1.6;
          flex: 1;
        ">
          ${feature}
        </p>
      </div>
    `).join('')}
  </div>
</div>`;
}

/**
 * Generate Specifications Section HTML
 * Layout: Striped table with two columns
 * Different from Hero (split view) and Features (list)
 */
export function generateSpecificationsSection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);
  const specs = product.rawData?.specifications || {};
  const specEntries = Object.entries(specs).slice(0, 10);
  const currentLocale = getLocale(platform, locale);

  return `
<div style="
  width: 800px;
  background: ${LG_BRAND.white};
  padding: 40px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
  border: 1px solid ${LG_BRAND.lightGray};
">
  <div style="
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  ">
    <div style="
      width: 36px;
      height: 36px;
      background: ${LG_BRAND.dark};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      ${getIconSvg('cpu', 20)}
    </div>
    <h2 style="
      font-size: 22px;
      font-weight: 700;
      color: ${LG_BRAND.dark};
      margin: 0;
      letter-spacing: -0.02em;
    ">
      ${t(currentLocale, 'technicalSpecs')}
    </h2>
  </div>
  <table style="
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  ">
    ${specEntries.map(([key, value], idx) => `
      <tr style="
        ${idx % 2 === 0 ? `background: ${LG_BRAND.lightGray};` : `background: ${LG_BRAND.white};`}
      ">
        <td style="
          padding: 14px 16px;
          font-weight: 600;
          color: ${LG_BRAND.dark};
          width: 45%;
          border-bottom: 1px solid ${idx === specEntries.length - 1 ? 'transparent' : '#e5e5e5'};
        ">${key}</td>
        <td style="
          padding: 14px 16px;
          color: ${LG_BRAND.gray};
          text-align: right;
          border-bottom: 1px solid ${idx === specEntries.length - 1 ? 'transparent' : '#e5e5e5'};
        ">${value}</td>
      </tr>
    `).join('')}
  </table>
</div>`;
}

/**
 * Generate Benefits Section HTML
 * Layout: 2x2 grid with icon cards on LG Red background
 * Different from other sections (full-width colored banner)
 */
export function generateBenefitsSection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);
  const currentLocale = getLocale(platform, locale);

  // Benefits with Phosphor icon names
  const benefits = [
    { iconName: 'coin', titleKey: 'energyEfficient', descKey: 'energySaveDesc' },
    { iconName: 'speakerLow', titleKey: 'whisperQuiet', descKey: 'quietDesc' },
    { iconName: 'smartphone', titleKey: 'smartHome', descKey: 'smartDesc' },
    { iconName: 'shield', titleKey: 'durable', descKey: 'durableDesc' },
  ];

  return `
<div style="
  width: 800px;
  background: ${LG_BRAND.primary};
  padding: 40px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
  color: white;
">
  <h2 style="
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 28px 0;
    text-align: center;
    letter-spacing: -0.02em;
  ">
    ${t(currentLocale, 'whyChooseLG')}
  </h2>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
    ${benefits.map(benefit => `
      <div style="
        background: rgba(255,255,255,0.12);
        border-radius: 8px;
        padding: 24px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
      ">
        <div style="
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          ${getIconSvg(benefit.iconName, 22)}
        </div>
        <div>
          <h3 style="
            font-size: 15px;
            font-weight: 600;
            margin: 0 0 6px 0;
          ">${t(currentLocale, benefit.titleKey)}</h3>
          <p style="
            font-size: 13px;
            opacity: 0.9;
            margin: 0;
            line-height: 1.5;
          ">${t(currentLocale, benefit.descKey)}</p>
        </div>
      </div>
    `).join('')}
  </div>
</div>`;
}

/**
 * Generate Warranty Section HTML
 * Layout: Horizontal card with shield icon left, content right
 * Different from other sections (green accent, trust-focused)
 */
export function generateWarrantySection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);
  const currentLocale = getLocale(platform, locale);

  const warrantyPoints = [
    { iconName: 'wrench', key: 'freeRepairs' },
    { iconName: 'certificate', key: 'genuineParts' },
    { iconName: 'globe', key: 'nationwideService' },
  ];

  return `
<div style="
  width: 800px;
  background: ${LG_BRAND.white};
  padding: 36px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
  border: 2px solid #c8e6c9;
">
  <div style="display: flex; gap: 28px; align-items: flex-start;">
    <div style="
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: white;
    ">
      ${getIconSvg('shieldCheck', 40)}
    </div>
    <div style="flex: 1;">
      <h2 style="
        font-size: 20px;
        font-weight: 700;
        color: ${LG_BRAND.dark};
        margin: 0 0 10px 0;
        letter-spacing: -0.02em;
      ">
        ${t(currentLocale, 'warrantyTitle')}
      </h2>
      <p style="
        font-size: 14px;
        color: ${LG_BRAND.gray};
        margin: 0 0 18px 0;
        line-height: 1.6;
      ">
        ${t(currentLocale, 'warrantyDesc')}
      </p>
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        ${warrantyPoints.map(point => `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #43a047;">${getIconSvg('checkCircle', 18)}</span>
            <span style="font-size: 13px; color: ${LG_BRAND.dark}; font-weight: 500;">${t(currentLocale, point.key)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</div>`;
}

/**
 * Generate Gallery Section HTML
 * Layout: Grid of product images (gallery + lifestyle)
 * Uses images from product.galleryImages and product.lifestyleImages
 */
export function generateGallerySection(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): string {
  const styles = getStyles(platform);

  // Combine gallery and lifestyle images, limit to 6
  const allImages = [
    ...(product.galleryImages || []),
    ...(product.lifestyleImages || []),
  ].slice(0, 6);

  if (allImages.length === 0) {
    return ''; // No gallery if no images
  }

  return `
<div style="
  width: 800px;
  background: ${LG_BRAND.lightGray};
  padding: 32px;
  font-family: ${styles.fontFamily};
  border-radius: 8px;
">
  <div style="
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  ">
    ${allImages.map((img, idx) => `
      <div style="
        aspect-ratio: 4/3;
        background: ${LG_BRAND.white};
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        ${idx === 0 ? 'grid-column: span 2; grid-row: span 2;' : ''}
      ">
        <img
          src="${img.src}"
          alt="${img.alt || product.title}"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
        />
      </div>
    `).join('')}
  </div>
</div>`;
}

/**
 * Generate Full Template combining all sections
 * Optimized for eBay: simple formatting, mobile-first, minimal HTML
 */
export function generateFullTemplate(
  product: ProductData,
  platform: string,
  locale?: SupportedLocale
): GeneratedHtmlContent {
  const currentLocale = getLocale(platform, locale);
  const styles = getStyles(platform);

  const heroSection = generateHeroSection(product, platform, currentLocale);
  const featuresSection = generateFeaturesSection(product, platform, currentLocale);
  const specificationsSection = generateSpecificationsSection(product, platform, currentLocale);
  const benefitsSection = generateBenefitsSection(product, platform, currentLocale);
  const warrantySection = generateWarrantySection(product, platform, currentLocale);
  const gallerySection = generateGallerySection(product, platform, currentLocale);

  const fullTemplate = `
<!DOCTYPE html>
<html lang="${currentLocale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${product.title.substring(0, 80)} - LG</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${LG_BRAND.lightGray};
      font-family: ${styles.fontFamily};
      color: ${LG_BRAND.dark};
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding: 16px;">
    ${heroSection}
    ${gallerySection}
    ${featuresSection}
    ${specificationsSection}
    ${benefitsSection}
    ${warrantySection}
  </div>
</body>
</html>`;

  return {
    heroSection,
    featuresSection,
    specificationsSection,
    benefitsSection,
    warrantySection,
    gallerySection,
    fullTemplate,
  };
}

/**
 * Get platform locale (extended version supporting all locales)
 * @deprecated Use getLocale() instead for internal use
 * This is kept for backwards compatibility with external callers
 */
export function getPlatformLocale(platform: string): SupportedLocale {
  const styles = getStyles(platform);
  return styles.locale || 'en';
}
