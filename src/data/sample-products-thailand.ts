/**
 * ข้อมูลตัวอย่างผลิตภัณฑ์สำหรับประเทศไทย - Shopee / Lazada
 * Sample Product Data for Thailand - Shopee / Lazada Marketplace
 * แปลจากข้อมูลผลิตภัณฑ์ LG Germany OLED C5
 */

import { LGProductData, GeneratedContent, ContentPipeline } from '@/types/product';

// ผลิตภัณฑ์ตัวอย่างจาก LG ประเทศไทย - OLED C5
export const thailandProducts: LGProductData[] = [
  {
    id: 'oled48c5-th',
    sku: 'OLED48C5PTA',
    country: 'th',
    sourceUrl: 'https://www.lg.com/th/tvs/oled-evo/oled48c5pta/',
    crawledAt: '2026-01-20T03:40:13.854Z',
    product: {
      title: 'LG OLED evo AI C5 48 นิ้ว 4K Smart TV',
      shortDescription: 'สัมผัสประสบการณ์ภาพสีดำสมบูรณ์แบบและสีสันสดใสด้วยโปรเซสเซอร์ α9 AI Gen8',
      longDescription: 'LG OLED evo C5 มอบประสบการณ์การรับชมที่ไม่มีใครเทียบได้ด้วยพิกเซลที่เปล่งแสงเอง สร้างสีดำที่สมบูรณ์แบบและสีกว่าพันล้านเฉด โปรเซสเซอร์ α9 AI Gen8 ปรับแต่งภาพและเสียงแบบเรียลไทม์สำหรับทุกฉาก พร้อมฟังก์ชัน AI ที่ช่วยให้คุณค้นหาและเลือกรับชมเนื้อหาได้ง่ายขึ้น',
      category: {
        primary: 'ทีวี',
        secondary: 'OLED TV',
        tertiary: 'OLED evo C5',
        breadcrumb: ['หน้าแรก', 'ทีวีและซาวด์บาร์', 'OLED evo', 'OLED C5'],
      },
      brand: 'LG',
    },
    pricing: {
      currency: 'THB',
      currentPrice: 49990,
      originalPrice: 59990,
      discountPercent: 17,
      priceValidUntil: '2026-02-28',
    },
    images: {
      main: {
        id: 'main-oled48c5-th',
        url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-01.jpg',
        type: 'main',
        width: 800,
        height: 531,
        altText: 'LG OLED evo AI C5 48 นิ้ว ภาพด้านหน้า',
        sortOrder: 0,
      },
      gallery: [
        {
          id: 'gallery-1-oled48c5-th',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-03.jpg',
          type: 'gallery',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 ภาพด้านหลัง',
          sortOrder: 1,
        },
        {
          id: 'gallery-2-oled48c5-th',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/2025_ms_lg-com/tv/oled-evo/c5/gp1/gallery/c5e/48-c5e-b/gallery/oled-c5e-2025-48-gallery-04.jpg',
          type: 'gallery',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 ภาพด้านข้าง',
          sortOrder: 2,
        },
        {
          id: 'lifestyle-1-oled48c5-th',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/_he/2025/tvs/gallery/oled48c59lb/Perfect-Black-dz.jpg',
          type: 'lifestyle',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 ในห้องนั่งเล่น',
          sortOrder: 3,
        },
      ],
      banners: [
        {
          id: 'banner-1-oled48c5-th',
          url: 'https://www.lg.com/content/dam/channel/wcms/de/_he/2025/tvs/gallery/oled48c59lb/a9-Prozessor-dz.jpg',
          type: 'banner',
          width: 800,
          height: 531,
          altText: 'LG OLED evo C5 แบนเนอร์โปรโมชั่น',
          containsText: true,
          extractedText: 'สีดำสมบูรณ์แบบ คอนทราสต์ไร้ขีดจำกัด',
          sortOrder: 0,
        },
      ],
    },
    specifications: {
      raw: [
        { group: 'จอแสดงผล', name: 'ขนาดหน้าจอ', value: '48', unit: 'นิ้ว' },
        { group: 'จอแสดงผล', name: 'ความละเอียด', value: '3840 x 2160', unit: 'พิกเซล' },
        { group: 'จอแสดงผล', name: 'ประเภทแผง', value: 'OLED evo' },
        { group: 'จอแสดงผล', name: 'อัตราการรีเฟรช', value: '120', unit: 'Hz' },
        { group: 'จอแสดงผล', name: 'HDR', value: 'Dolby Vision, HDR10, HLG' },
        { group: 'โปรเซสเซอร์', name: 'โปรเซสเซอร์', value: 'α9 AI Processor Gen8' },
        { group: 'เสียง', name: 'กำลังขับ', value: '40', unit: 'W' },
        { group: 'เสียง', name: 'ลำโพง', value: '2.2 Channel' },
        { group: 'เสียง', name: 'Dolby Atmos', value: 'ใช่' },
        { group: 'สมาร์ททีวี', name: 'ระบบปฏิบัติการ', value: 'webOS 25' },
        { group: 'สมาร์ททีวี', name: 'ผู้ช่วยเสียง', value: 'LG ThinQ AI, Alexa, Google Assistant' },
        { group: 'การเชื่อมต่อ', name: 'HDMI', value: '4x HDMI 2.1' },
        { group: 'การเชื่อมต่อ', name: 'USB', value: '3x USB' },
        { group: 'การเชื่อมต่อ', name: 'WLAN', value: 'Wi-Fi 6E' },
        { group: 'เกมมิ่ง', name: 'NVIDIA G-SYNC', value: 'ใช่' },
        { group: 'เกมมิ่ง', name: 'AMD FreeSync Premium', value: 'ใช่' },
        { group: 'เกมมิ่ง', name: 'VRR', value: 'ใช่' },
        { group: 'ขนาด', name: 'พร้อมขาตั้ง (กxสxล)', value: '1071 x 675 x 239', unit: 'มม.' },
        { group: 'ขนาด', name: 'ไม่รวมขาตั้ง (กxสxล)', value: '1071 x 620 x 45', unit: 'มม.' },
        { group: 'น้ำหนัก', name: 'พร้อมขาตั้ง', value: '14.9', unit: 'กก.' },
        { group: 'น้ำหนัก', name: 'ไม่รวมขาตั้ง', value: '11.3', unit: 'กก.' },
        { group: 'พลังงาน', name: 'ระดับประสิทธิภาพพลังงาน', value: 'G' },
        { group: 'พลังงาน', name: 'การใช้พลังงาน (SDR)', value: '85', unit: 'W' },
      ],
      normalized: {
        dimensions: { width: 1071, height: 620, depth: 45, unit: 'mm' },
        weight: { value: 11.3, unit: 'kg' },
        power: { consumption: 85, voltage: '220V~', energyClass: 'G' },
        screenSize: 48,
        resolution: '4K UHD (3840x2160)',
      },
    },
    marketing: {
      usps: [
        {
          headline: 'โปรเซสเซอร์ α9 AI Gen8',
          description: 'การปรับแต่งภาพและเสียงอัจฉริยะด้วย Deep Learning',
          icon: 'processor',
        },
        {
          headline: 'สีดำสมบูรณ์แบบ',
          description: 'พิกเซลเปล่งแสงเองสร้างคอนทราสต์ไร้ขีดจำกัด',
          icon: 'contrast',
        },
        {
          headline: '4K 120Hz Gaming',
          description: 'NVIDIA G-SYNC และ AMD FreeSync Premium สำหรับเกมที่ลื่นไหล',
          icon: 'gaming',
        },
        {
          headline: 'Dolby Vision & Atmos',
          description: 'ประสบการณ์ภาพยนตร์พร้อมเสียงรอบทิศทาง',
          icon: 'dolby',
        },
      ],
      features: [
        {
          title: 'เทคโนโลยี OLED evo',
          description: 'เทคโนโลยี OLED รุ่นถัดไปที่ให้ภาพสว่างกว่าและสีสดใสกว่า',
          image: 'https://www.lg.com/th/images/tv/features/oled-evo.jpg',
        },
        {
          title: 'AI Picture Pro',
          description: 'การปรับภาพด้วย AI รู้จำประเภทเนื้อหาและปรับความสว่าง ความคม และคอนทราสต์โดยอัตโนมัติ',
          image: 'https://www.lg.com/th/images/tv/features/ai-picture.jpg',
        },
        {
          title: 'webOS 25',
          description: 'คำแนะนำส่วนบุคคลและการเข้าถึงบริการสตรีมมิ่งทั้งหมดอย่างรวดเร็ว',
          image: 'https://www.lg.com/th/images/tv/features/webos25.jpg',
        },
      ],
      awards: ['CES 2025 Innovation Award', 'Red Dot Design Award 2025'],
      certifications: [
        { name: 'TÜV Eye Comfort Display', validUntil: '2026-12' },
        { name: 'Netflix Calibrated', validUntil: '2026-12' },
      ],
    },
    seo: {
      metaTitle: 'LG OLED evo AI C5 48 นิ้ว 4K Smart TV | OLED48C5PTA | LG Thailand',
      metaDescription: 'ค้นพบ LG OLED evo TV C5 พร้อมโปรเซสเซอร์ α9 AI Gen8 สีดำสมบูรณ์แบบ และ Dolby Vision ซื้อเลยวันนี้!',
      keywords: ['LG OLED', 'OLED TV', '48 นิ้ว', '4K TV', 'Smart TV', 'Dolby Vision', 'Gaming TV', 'ทีวี OLED'],
      canonicalUrl: 'https://www.lg.com/th/tvs/oled-evo/oled48c5pta/',
      structuredData: {
        '@type': 'Product',
        name: 'LG OLED evo AI C5 48 นิ้ว 4K Smart TV',
        brand: { '@type': 'Brand', name: 'LG' },
      },
    },
    availability: {
      inStock: true,
      stockLevel: 'in_stock',
      deliveryEstimate: 'จัดส่งภายใน 2-4 วันทำการ',
    },
    related: {
      accessories: ['SP9YA', 'WM25'],
      similarProducts: ['OLED55C5PTA', 'OLED65C5PTA', 'OLED65G5PTA'],
      bundles: ['OLED48C5PTA-BUNDLE-SP9YA'],
    },
    metadata: {
      crawlStatus: 'success',
      crawlDuration: 4500,
      pageLoadTime: 2100,
      version: 1,
    },
  },
];

// เนื้อหาที่สร้างสำหรับ Shopee Thailand
export const thailandGeneratedContent: GeneratedContent[] = [
  {
    id: 'gen-oled48c5-th-shopee-listing',
    productId: 'oled48c5-th',
    platform: 'shopee',
    contentType: 'full_package',
    status: 'pending_review',
    content: {
      title: 'LG OLED evo AI C5 48นิ้ว 4K Smart TV | สีดำสมบูรณ์ | 120Hz Gaming',
      description: `🎬 LG OLED evo AI C5 48 นิ้ว 4K Smart TV - ทีวี OLED คุณภาพระดับพรีเมียม

✨ จุดเด่นของสินค้า:
• หน้าจอ OLED evo 48 นิ้ว สีดำสมบูรณ์แบบ คอนทราสต์ไร้ขีดจำกัด
• โปรเซสเซอร์ α9 AI Gen8 ปรับภาพและเสียงอัจฉริยะด้วย AI
• รองรับ 4K 120Hz พร้อม NVIDIA G-SYNC และ AMD FreeSync Premium
• Dolby Vision IQ และ Dolby Atmos เสียงรอบทิศทางเหมือนอยู่ในโรงภาพยนตร์
• webOS 25 พร้อมแอปสตรีมมิ่งครบครัน Netflix, Disney+, YouTube และอื่นๆ

🎮 สำหรับเกมเมอร์:
• VRR (Variable Refresh Rate) ภาพไม่กระตุก
• ALLM (Auto Low Latency Mode) อินพุตแล็กต่ำ
• Game Optimizer ปรับแต่งการตั้งค่าเกมได้ง่าย

📦 ในกล่องประกอบด้วย:
• ทีวี LG OLED48C5PTA
• รีโมทคอนโทรล Magic Remote
• ขาตั้ง
• คู่มือการใช้งาน
• สายไฟ

🛡️ รับประกัน:
• รับประกันศูนย์ LG Thailand 2 ปี
• รับประกันจอ Burn-in 2 ปี

📱 สอบถามเพิ่มเติม กรุณาแชทมาหาเราได้เลยค่ะ`,
      bulletPoints: [
        '✅ จอ OLED evo 48 นิ้ว ความละเอียด 4K UHD สีดำสมบูรณ์แบบ',
        '✅ โปรเซสเซอร์ α9 AI Gen8 ปรับภาพและเสียงอัจฉริยะ',
        '✅ รองรับ 4K 120Hz Gaming พร้อม G-SYNC และ FreeSync',
        '✅ Dolby Vision IQ และ Dolby Atmos เสียงรอบทิศทาง',
        '✅ webOS 25 พร้อมแอปสตรีมมิ่งครบ ใช้งานง่าย',
      ],
    },
    generatedAt: '2026-01-20T15:00:00Z',
  },
  {
    id: 'gen-oled48c5-th-lazada-listing',
    productId: 'oled48c5-th',
    platform: 'lazada',
    contentType: 'full_package',
    status: 'pending_review',
    content: {
      title: '[ส่งฟรี] LG OLED evo AI C5 48 นิ้ว 4K Smart TV ประกันศูนย์ 2 ปี',
      description: `# LG OLED evo AI C5 48 นิ้ว 4K Smart TV

## รายละเอียดสินค้า
LG OLED evo AI C5 ทีวี OLED ระดับพรีเมียมที่มาพร้อมเทคโนโลยีล้ำสมัย หน้าจอ OLED evo ให้สีดำที่สมบูรณ์แบบและคอนทราสต์ที่เหนือระดับ

## คุณสมบัติเด่น
• **โปรเซสเซอร์ α9 AI Gen8** - ปรับแต่งภาพและเสียงอัจฉริยะแบบเรียลไทม์
• **OLED evo Technology** - ภาพสว่างกว่าและสีสดใสกว่า OLED ทั่วไป
• **4K 120Hz Gaming** - รองรับ NVIDIA G-SYNC และ AMD FreeSync Premium
• **Dolby Vision IQ & Atmos** - ประสบการณ์ภาพและเสียงระดับโรงภาพยนตร์
• **webOS 25** - ระบบปฏิบัติการที่ใช้งานง่าย พร้อมแอปสตรีมมิ่งครบครัน

## สเปค
• ขนาดหน้าจอ: 48 นิ้ว
• ความละเอียด: 4K UHD (3840x2160)
• อัตราการรีเฟรช: 120Hz
• HDR: Dolby Vision, HDR10, HLG
• เสียง: 40W 2.2ch, Dolby Atmos
• การเชื่อมต่อ: 4x HDMI 2.1, 3x USB, Wi-Fi 6E, Bluetooth 5.1

## การรับประกัน
รับประกันศูนย์ LG Thailand 2 ปีเต็ม พร้อมรับประกันจอ Burn-in 2 ปี

## บริการ
✅ ส่งฟรีทั่วประเทศ
✅ ติดตั้งฟรี (เขตกรุงเทพฯ และปริมณฑล)
✅ ชำระปลายทางได้`,
      bulletPoints: [
        'หน้าจอ OLED evo 48 นิ้ว สีดำสมบูรณ์แบบ คอนทราสต์ไร้ขีดจำกัด',
        'โปรเซสเซอร์ α9 AI Gen8 ปรับภาพและเสียงด้วย AI อัจฉริยะ',
        '4K 120Hz Gaming พร้อม G-SYNC และ FreeSync Premium',
        'Dolby Vision IQ และ Dolby Atmos เสียงรอบทิศทาง',
        'webOS 25 พร้อมแอปสตรีมมิ่งครบครัน ใช้งานง่าย',
        'รับประกันศูนย์ LG Thailand 2 ปี',
        'ส่งฟรี ติดตั้งฟรี (กทม. และปริมณฑล)',
        'ผ่อนได้ 0% นานสูงสุด 10 เดือน',
      ],
    },
    generatedAt: '2026-01-20T15:30:00Z',
  },
];

// ไปป์ไลน์สำหรับประเทศไทย
export const thailandPipelines: ContentPipeline[] = [
  {
    id: 'pipeline-oled48c5-th-shopee',
    productId: 'oled48c5-th',
    targetPlatforms: ['shopee'],
    channel: '3p',
    status: 'in_progress',
    createdAt: '2026-01-20T14:00:00Z',
    steps: [
      {
        id: 'step-1',
        name: 'ตรวจสอบรูปภาพ',
        status: 'completed',
        startedAt: '2026-01-20T14:00:00Z',
        completedAt: '2026-01-20T14:03:00Z',
        duration: 180000,
        output: { imagesVerified: 4, specsVerified: true, sizeCompliant: true },
      },
      {
        id: 'step-2',
        name: 'ตรวจสอบสเปค',
        status: 'completed',
        startedAt: '2026-01-20T14:03:00Z',
        completedAt: '2026-01-20T14:05:00Z',
        duration: 120000,
        output: { specsValidated: 24, issuesFound: 0 },
      },
      {
        id: 'step-3',
        name: 'ตรวจสอบการปฏิบัติตามข้อกำหนด',
        status: 'completed',
        startedAt: '2026-01-20T14:05:00Z',
        completedAt: '2026-01-20T14:08:00Z',
        duration: 180000,
        output: { complianceScore: 95, warnings: 1 },
      },
      {
        id: 'step-4',
        name: 'สร้างรูปปกและแบนเนอร์',
        status: 'completed',
        startedAt: '2026-01-20T14:08:00Z',
        completedAt: '2026-01-20T14:15:00Z',
        duration: 420000,
        output: { bannersGenerated: 3, thumbnailsGenerated: 2 },
      },
      {
        id: 'step-5',
        name: 'สร้างคำอธิบายสินค้า',
        status: 'in_progress',
        startedAt: '2026-01-20T14:15:00Z',
      },
      {
        id: 'step-6',
        name: 'ปรับแต่ง SEO',
        status: 'pending',
      },
      {
        id: 'step-7',
        name: 'ตรวจสอบโดยทีมงาน',
        status: 'pending',
      },
      {
        id: 'step-8',
        name: 'อัปโหลดขึ้น Shopee',
        status: 'pending',
      },
    ],
  },
  {
    id: 'pipeline-oled48c5-th-lazada',
    productId: 'oled48c5-th',
    targetPlatforms: ['lazada'],
    channel: '3p',
    status: 'in_progress',
    createdAt: '2026-01-20T14:30:00Z',
    steps: [
      {
        id: 'step-1',
        name: 'ตรวจสอบรูปภาพ',
        status: 'completed',
        startedAt: '2026-01-20T14:30:00Z',
        completedAt: '2026-01-20T14:33:00Z',
        duration: 180000,
        output: { imagesVerified: 4, specsVerified: true, sizeCompliant: true },
      },
      {
        id: 'step-2',
        name: 'ตรวจสอบสเปค',
        status: 'completed',
        startedAt: '2026-01-20T14:33:00Z',
        completedAt: '2026-01-20T14:35:00Z',
        duration: 120000,
        output: { specsValidated: 24, issuesFound: 0 },
      },
      {
        id: 'step-3',
        name: 'ตรวจสอบการปฏิบัติตามข้อกำหนด',
        status: 'completed',
        startedAt: '2026-01-20T14:35:00Z',
        completedAt: '2026-01-20T14:38:00Z',
        duration: 180000,
        output: { complianceScore: 97, warnings: 0 },
      },
      {
        id: 'step-4',
        name: 'สร้างรูปปกและแบนเนอร์',
        status: 'in_progress',
        startedAt: '2026-01-20T14:38:00Z',
      },
      {
        id: 'step-5',
        name: 'สร้างคำอธิบายสินค้า',
        status: 'pending',
      },
      {
        id: 'step-6',
        name: 'ปรับแต่ง SEO',
        status: 'pending',
      },
      {
        id: 'step-7',
        name: 'ตรวจสอบโดยทีมงาน',
        status: 'pending',
      },
      {
        id: 'step-8',
        name: 'อัปโหลดขึ้น Lazada',
        status: 'pending',
      },
    ],
  },
];

// การกำหนดค่าแพลตฟอร์มสำหรับประเทศไทย
export const thailandPlatformConfigs = {
  shopee: {
    name: 'Shopee Thailand',
    logo: '/platforms/shopee.svg',
    color: '#EE4D2D',
    requirements: {
      imageSize: { width: 1024, height: 1024 },
      titleMaxLength: 120,
      descriptionMaxLength: 3000,
      bulletPointsMax: 5,
      minImages: 3,
      maxImages: 9,
      whiteBackgroundRecommended: true,
    },
    fees: {
      commissionRate: 0.06, // 6%
      transactionFee: 0.02, // 2%
    },
    language: 'th-TH',
  },
  lazada: {
    name: 'Lazada Thailand',
    logo: '/platforms/lazada.svg',
    color: '#0F146D',
    requirements: {
      imageSize: { width: 800, height: 800 },
      minImageSize: { width: 330, height: 330 },
      maxImageSize: { width: 5000, height: 5000 },
      titleMaxLength: 255,
      descriptionMaxLength: 5000,
      bulletPointsMax: 8,
      minImages: 1,
      maxImages: 8,
    },
    fees: {
      commissionRate: 0.04, // 1-4% ขึ้นอยู่กับหมวดหมู่
      vat: 0.07, // 7% VAT
    },
    language: 'th-TH',
  },
};

// หมวดหมู่สินค้าสำหรับประเทศไทย
export const thailandProductCategories = [
  { id: 'tv', name: 'ทีวี', icon: 'television', count: 45 },
  { id: 'audio', name: 'เครื่องเสียง', icon: 'speaker-high', count: 23 },
  { id: 'refrigerator', name: 'ตู้เย็น', icon: 'fridge', count: 31 },
  { id: 'washing-machine', name: 'เครื่องซักผ้า', icon: 'washing-machine', count: 28 },
  { id: 'air-conditioner', name: 'เครื่องปรับอากาศ', icon: 'snowflake', count: 35 },
  { id: 'vacuum', name: 'เครื่องดูดฝุ่น', icon: 'broom', count: 19 },
  { id: 'monitor', name: 'จอมอนิเตอร์', icon: 'monitor', count: 37 },
  { id: 'laptop', name: 'แล็ปท็อป', icon: 'laptop', count: 12 },
];
