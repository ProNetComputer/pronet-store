import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "data", "pronet.db");
const db = new DatabaseSync(dbPath);

// 1. تحديث الإعدادات الإنجليزية لضمان عمل الهيدر والفوتر ومن نحن وتواصل معنا باللغتين
const settingsPatch = {
  brandNameEn: "ProNet Computer",
  sloganEn: "Precision Services • Integrated Technology Solutions",
  announcementEn: "ProNet Computer – Aden Al-Mualla: Complete Solutions for Computers, Networking, Fiber & Starlink Internet, and Security Systems",
  heroBadgeEn: "Integrated IT Solutions for Enterprises, NGOs & Individuals in Aden & Across Yemen",
  heroTitleEn: "ProNet Computer — Latest Technologies & Enterprise Solutions",
  heroSubtitleEn: "Your premier destination in Aden for business laptops, enterprise networking (MikroTik, Ubiquiti & WiFi 6), Fiber & Starlink internet, and CCTV surveillance.",
  addressEn: "Yemen - Aden - Al-Mualla - Main Street (Shahid Madram St.) - Opposite Al-Kuraimi Bank",
  ceoTitleEn: "Chief Executive Officer - ProNet Computer",
};

const upsertSetting = db.prepare(
  "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
);
for (const [k, v] of Object.entries(settingsPatch)) {
  upsertSetting.run(k, JSON.stringify(v));
}

// 2. تحديث ترجمة الفئات (Categories)
const categoriesEn = {
  "اجهزة الكميبوتر  المكتبيه والمحمولة والسيرفرات": "Laptops & Desktops",
  "الشبكات والاتصالات  والربط الشبكي": "Networking & Outdoor Wireless",
  "كاميرات المراقبة ومستلزماتها واجهزة التحكم بالوصول": "CCTV & Security Systems",
  "الطابعات ومستلزماتها": "Printers & Consumables",
  "الطاقة والحماية الكهربائية": "UPS & Power Protection",
  "الإنترنت الفضائي Starlink  وخدمات السداد والدعم الفني": "Starlink Satellite Internet",
  "الإكسسوارات والتخزين": "Accessories & Storage",
  "الجوالات وإكسسواراتها": "Smartphones & Accessories",
};
const updateCat = db.prepare("UPDATE categories SET name_en = ? WHERE name = ?");
for (const [ar, en] of Object.entries(categoriesEn)) {
  updateCat.run(en, ar);
}

// 3. تحديث ترجمة مجالات العمل (Business Areas)
const areasEn = [
  { id: "ba1", titleEn: "Networking & Wireless Links", descEn: "Supply and configuration of MikroTik & Ubiquiti routers, switches, Fiber Optics, and outdoor WiFi 6 links for ISPs and enterprises." },
  { id: "ba2", titleEn: "Business Laptops & Desktops", descEn: "Latest business, engineering, and workstation computers from HP, Dell, Lenovo, and Asus with certified warranty." },
  { id: "ba3", titleEn: "CCTV & Security Systems", descEn: "IP and ColorVu surveillance systems from Hikvision & Dahua, plus biometric time-attendance and access control." },
  { id: "ba4", titleEn: "Starlink Satellite Internet", descEn: "Genuine Starlink kits and accessories with activation, mounting, and Multi-WAN integration with MikroTik networks." },
  { id: "ba5", titleEn: "UPS & Power Protection", descEn: "Automatic Voltage Regulators (AVR) and Online/Line-Interactive UPS systems to protect servers and sensitive equipment." },
  { id: "ba6", titleEn: "Printers & Office Equipment", descEn: "Color and monochrome laser multifunction printers, scanners, POS equipment, and original consumables." },
  { id: "ba7", titleEn: "Storage & Peripherals", descEn: "High-speed NVMe SSDs, external enclosures, professional keyboards, mice, cooling stands, and networking cables." },
  { id: "ba8", titleEn: "Enterprise & NGO Tenders (B2B)", descEn: "Turnkey IT supply, Data Center setup, audio-visual halls, and maintenance contracts for NGOs, hotels, banks, and universities." },
];
const updateArea = db.prepare("UPDATE business_areas SET title_en = ?, description_en = ? WHERE id = ?");
for (const a of areasEn) {
  updateArea.run(a.titleEn, a.descEn, a.id);
}

// 4. تحديث شرائح العرض (Hero Slides)
const slidesEn = [
  {
    id: "s1",
    badgeEn: "Integrated IT Solutions in Aden & Across Yemen",
    titleEn: "ProNet Computer — Precision Enterprise & Tech Solutions",
    subtitleEn: "Your premier partner in Aden for laptops, enterprise networking, Fiber & Starlink internet, and smart security systems.",
    ctaLabelEn: "Browse Store",
  },
  {
    id: "s2",
    badgeEn: "Network Infrastructure, Fiber Optics & Satellite Connectivity",
    titleEn: "MikroTik & Ubiquiti Enterprise Networks & Genuine Starlink Systems",
    subtitleEn: "Supply, installation, and configuration of WiFi 6 access points, switches, Fiber Optics, and branch connectivity for NGOs and hotels.",
    ctaLabelEn: "Browse Store",
  },
  {
    id: "s3",
    badgeEn: "Digital Security Systems & Complete Office Provisioning",
    titleEn: "Hikvision Smart Cameras, Business Workstations & LaserJet Printers",
    subtitleEn: "Complete 4K ColorVu security protection alongside business laptops, desktops, and laser printers with official warranty.",
    ctaLabelEn: "Browse Store",
  },
];
const updateSlide = db.prepare(
  "UPDATE slides SET badge_en = ?, title_en = ?, subtitle_en = ?, cta_label_en = ? WHERE id = ?"
);
for (const s of slidesEn) {
  updateSlide.run(s.badgeEn, s.titleEn, s.subtitleEn, s.ctaLabelEn, s.id);
}

// 5. إحلال وتحديث جميع المشاريع الـ 20 المنقحة باللغتين العربية والإنجليزية
const catNGO = "مشاريع المنظمات الدولية والمؤسسات";
const catHosp = "مشاريع الفنادق والمنشآت السياحية والضيافة";
const catInd = "مشاريع الطاقة والشركات والمصانع والملاحة";
const catFac = "مشاريع الجامعات والمستشفيات والمطارات والمراكز التجارية";

const projects = [
  {
    id: "proj-had",
    category: catNGO,
    location: "عدن | Aden",
    title: "منظمة العون الإنساني والتنمية (HAD) – مكتب عدن",
    titleEn: "Humanitarian Aid & Development (HAD) – Aden Office",
    desc: [
      "تجهيز وتركيب منظومة الشبكة الداخلية المتكاملة ونظام المراقبة الأمنية.",
      "TAGS: LAN Network, CCTV Security, Structured Cabling",
      "• تأسيس وتمديد البنية التحتية لشبكة البيانات الداخلية (LAN) وربط المكاتب الإدارية وفق أعلى المعايير الهندسية.",
      "• تركيب وتشغيل منظومة كاميرات المراقبة الأمنية عالية الدقة لتأمين كافة المرافق والمداخل على مدار الساعة."
    ].join("\n"),
    descEn: [
      "Complete internal LAN network infrastructure setup and CCTV security surveillance system installation.",
      "TAGS: LAN Network, CCTV Security, Structured Cabling",
      "• Designed and deployed structured internal LAN cabling connecting all administrative offices.",
      "• Installed and configured high-definition CCTV security cameras for 24/7 premises monitoring."
    ].join("\n"),
  },
  {
    id: "proj-read",
    category: catNGO,
    location: "عدن | Aden",
    title: "مؤسسة إقرأ للتعليم والتنمية (READ Foundation)",
    titleEn: "READ Foundation – Aden Office",
    desc: [
      "صيانة شاملة وإعادة تأهيل منظومة كاميرات المراقبة والشبكة الداخلية.",
      "TAGS: Network Rehab, CCTV Maintenance, IT Support",
      "• فحص وصيانة وإعادة تأهيل مسارات وكبائن الشبكة السلكية الداخلية (LAN) لرفع كفاءة الاتصال.",
      "• إعادة تأهيل وتحديث منظومة كاميرات المراقبة الأمنية وأجهزة التسجيل الشبكي وضبط زوايا التغطية."
    ].join("\n"),
    descEn: [
      "Comprehensive maintenance and rehabilitation of the CCTV surveillance system and internal LAN network.",
      "TAGS: Network Rehab, CCTV Maintenance, IT Support",
      "• Inspected, reorganized, and rehabilitated internal LAN cabling and network cabinets.",
      "• Upgraded and maintained security cameras and NVR recording units for optimal coverage."
    ].join("\n"),
  },
  {
    id: "proj-giz",
    category: catNGO,
    location: "عدن | Aden",
    title: "الوكالة الألمانية للتعاون الدولي (GIZ) – مكتب عدن",
    titleEn: "German Agency for International Cooperation (GIZ) – Aden Office",
    desc: [
      "تجهيز منظومة الشبكة الداخلية المؤسسية وتركيب وتشغيل الإنترنت الفضائي Starlink.",
      "TAGS: Enterprise LAN, Starlink, Network Security",
      "• تأسيس وتجهيز منظومة الشبكة السلكية الداخلية (LAN) للمكاتب وفق معايير الجودة العالمية.",
      "• تركيب وبرمجة وتشغيل منظومة الإنترنت الفضائي (Starlink) ودمجها مع الشبكة الداخلية لتوفير اتصال فائق ومستقر."
    ].join("\n"),
    descEn: [
      "Enterprise internal LAN network deployment and Starlink satellite internet installation & integration.",
      "TAGS: Enterprise LAN, Starlink, Network Security",
      "• Deployed enterprise-grade internal LAN infrastructure across administrative workspaces.",
      "• Installed, configured, and integrated Starlink satellite internet for high-speed, uninterrupted connectivity."
    ].join("\n"),
  },
  {
    id: "proj-kfw",
    category: catNGO,
    location: "عدن | Aden",
    title: "مكتب بنك التنمية الألماني في اليمن (KfW Office Aden)",
    titleEn: "KfW Development Bank Office – Aden",
    desc: [
      "تركيب وتشغيل الشبكة الداخلية المتكاملة ومنظومة الإنترنت الفضائي Starlink.",
      "TAGS: LAN Setup, Starlink, Firewall & Routing",
      "• تنفيذ وتشغيل البنية التحتية للشبكة الداخلية (LAN) وتأمين نقاط الاتصال للموظفين.",
      "• تركيب وتشغيل منظومة الإنترنت الفضائي (Starlink) مع ضبط إعدادات الحماية وتوزيع السرعات بكفاءة عالية."
    ].join("\n"),
    descEn: [
      "Internal LAN network installation and Starlink satellite internet deployment.",
      "TAGS: LAN Setup, Starlink, Firewall & Routing",
      "• Installed and commissioned internal LAN data points and switching equipment.",
      "• Deployed and configured Starlink satellite connectivity with secure routing and bandwidth management."
    ].join("\n"),
  },
  {
    id: "proj-coral-hotel",
    category: catHosp,
    location: "عدن - خورمكسر | Aden",
    title: "فندق كورال عدن (CORAL ADEN HOTEL)",
    titleEn: "Coral Aden Hotel",
    desc: [
      "تأهيل غرفة السيرفرات والداتا سنتر، وإدخال إنترنت الألياف البصرية (Fiber) وStarlink، وتجهيز القاعات وشاشة LED العملاقة (8×3 متر).",
      "TAGS: Data Center, Fiber Optic, Starlink, WLAN/LAN, CCTV, AV & LED 8x3m",
      "• صيانة وتأهيل غرفة السيرفرات ومركز البيانات (Data Center) وصيانة الشبكة الداخلية (LAN).",
      "• إدخال وربط خدمات إنترنت الألياف البصرية (Fiber Optic) إلى الشبكة ودمجها مع منظومات الإنترنت الفضائي (Starlink) لضمان أعلى سرعة واستقرار دون انقطاع.",
      "• صيانة وتحديث منظومة شبكة الإنترنت والواي فاي (WLAN) لتغطية كافة أجنحة وغرف ومرافق الفندق.",
      "• إعادة تأهيل وتطوير منظومة كاميرات المراقبة الأمنية (CCTV) في كافة المداخل والممرات.",
      "• إعادة تأهيل وتركيب المستلزمات التقنية وأنظمة العرض المرئي والصوتي والاتصالات المرئية لقاعة البتراء والخيمة وكافة قاعات الفعاليات والأعراس والمؤتمرات.",
      "• تركيب وتشغيل شاشة العرض الضخمة (LED Screen) بمقاس 8×3 متر في مسرح قاعة البتراء."
    ].join("\n"),
    descEn: [
      "Data Center rehabilitation, Fiber Optic & Starlink integration, hotel-wide Wi-Fi & CCTV upgrade, conference AV systems, and an 8x3m LED stage screen.",
      "TAGS: Data Center, Fiber Optic, Starlink, WLAN/LAN, CCTV, AV & LED 8x3m",
      "• Rehabilitated and maintained the main Server Room, Data Center, and internal LAN infrastructure.",
      "• Integrated high-speed Fiber Optic internet alongside Starlink satellite systems with Multi-WAN failover.",
      "• Upgraded hotel-wide wireless internet and Wi-Fi (WLAN) coverage across all guest rooms and facilities.",
      "• Modernized and expanded the security surveillance camera system (CCTV).",
      "• Equipped Petra Hall, the Royal Tent, and conference/wedding halls with professional audio-visual (AV) and video conferencing systems.",
      "• Supplied and installed a massive 8×3 meter LED Display Screen on the Petra Hall stage."
    ].join("\n"),
  },
  {
    id: "proj-dolphin-resort",
    category: catHosp,
    location: "عدن | Aden",
    title: "منتجع وشاليهات الدولفين – عدن (Dolphin Resort & Chalets)",
    titleEn: "Dolphin Resort & Chalets – Aden",
    desc: [
      "تأسيس البنية التحتية التقنية الشاملة للمنتجع والقاعات والشاليهات، وربط الألياف البصرية، والمراقبة والصوتيات والشاشات.",
      "TAGS: Turnkey Infrastructure, Fiber Optic, WLAN/LAN, CCTV, Pro Audio & Visual",
      "• تأسيس البنية التحتية المتكاملة للمنتجع والقاعات والشاليهات بكل احتياجاتها التقنية.",
      "• إدخال وربط خدمات إنترنت الألياف البصرية (Fiber Optic) وتوزيع الشبكة الداخلية (LAN) للمكاتب والمرافق الخدمية ومنظومة الواي فاي (WLAN).",
      "• تركيب وتشغيل أنظمة المراقبة الأمنية والكاميرات الذكية لحماية المنتجع والشاليهات.",
      "• تجهيز وتركيب منظومة الصوتيات الاحترافية ومنظومات العرض المرئية وشاشات العرض لقاعات الأعراس والمؤتمرات والتدريبات."
    ].join("\n"),
    descEn: [
      "Turnkey IT infrastructure for the resort, chalets, and halls including Fiber Optic internet, LAN/WLAN, CCTV, and pro audio-visual systems.",
      "TAGS: Turnkey Infrastructure, Fiber Optic, WLAN/LAN, CCTV, Pro Audio & Visual",
      "• Built the complete IT and networking infrastructure across the resort, chalets, offices, and service facilities.",
      "• Connected Fiber Optic internet services and deployed high-density indoor/outdoor Wi-Fi (WLAN) and wired LAN.",
      "• Installed comprehensive CCTV security surveillance across the resort perimeter and facilities.",
      "• Equipped wedding, conference, and training halls with professional sound systems, projectors, and display screens."
    ].join("\n"),
  },
  {
    id: "proj-royal-palace",
    category: catHosp,
    location: "عدن | Aden",
    title: "فندق القصر الملكي – عدن (Royal Palace Hotel)",
    titleEn: "Royal Palace Hotel – Aden",
    desc: [
      "إدخال وربط إنترنت الألياف البصرية (Fiber) وStarlink، وتحديث منظومة الواي فاي وكاميرات المراقبة الأمنية.",
      "TAGS: Fiber Optic, Starlink, Hotel Wi-Fi, CCTV Upgrade",
      "• إدخال وربط خدمات إنترنت الألياف البصرية (Fiber Optic) إلى الشبكة الأساسية للفندق.",
      "• تركيب ودمج منظومات الإنترنت الفضائي (Starlink) لتحقيق استقرار كامل للخدمة.",
      "• صيانة وتأهيل وتحديث منظومة شبكة الإنترنت والواي فاي (WLAN) لتغطية كافة الطوابق والغرف.",
      "• تركيب وتحديث منظومة الكاميرات والمراقبة الأمنية."
    ].join("\n"),
    descEn: [
      "Fiber Optic & Starlink internet integration, hotel Wi-Fi rehabilitation, and CCTV security system upgrade.",
      "TAGS: Fiber Optic, Starlink, Hotel Wi-Fi, CCTV Upgrade",
      "• Integrated Fiber Optic internet into the core hotel network alongside Starlink satellite systems.",
      "• Rehabilitated and upgraded the hotel-wide Wi-Fi (WLAN) network for seamless guest coverage.",
      "• Installed and upgraded high-definition security cameras and recording units."
    ].join("\n"),
  },
  {
    id: "proj-rose-hotel-2",
    category: catHosp,
    location: "عدن | Aden",
    title: "فندق روز عدن 2 (Rose Aden Hotel 2)",
    titleEn: "Rose Aden Hotel 2",
    desc: [
      "إدارة وتحديث وتشغيل شبكة الواي فاي، وإدخال إنترنت الألياف البصرية وStarlink، وتحديث منظومة المراقبة.",
      "TAGS: Fiber Optic, Starlink, Managed WLAN, CCTV Maintenance",
      "• إدخال وربط خدمات إنترنت الألياف البصرية (Fiber Optic) وتركيب منظومات الإنترنت الفضائي (Starlink).",
      "• إدارة وتحديث وتشغيل منظومة شبكة الإنترنت والواي فاي (WLAN) بأعلى كفاءة.",
      "• تحديث وصيانة منظومة الكاميرات والمراقبة الأمنية."
    ].join("\n"),
    descEn: [
      "Managed Wi-Fi operation, Fiber Optic & Starlink integration, and CCTV surveillance upgrade.",
      "TAGS: Fiber Optic, Starlink, Managed WLAN, CCTV Maintenance",
      "• Connected Fiber Optic internet services and integrated Starlink satellite internet.",
      "• Managed, upgraded, and operated the hotel Wi-Fi (WLAN) network.",
      "• Upgraded and maintained the CCTV security camera system."
    ].join("\n"),
  },
  {
    id: "proj-rose-hotel-1",
    category: catHosp,
    location: "عدن | Aden",
    title: "فندق روز عدن 1 (Rose Aden Hotel 1)",
    titleEn: "Rose Aden Hotel 1",
    desc: [
      "صيانة وتأهيل شبكة الواي فاي، وإدخال إنترنت الألياف البصرية وStarlink، وتحديث كاميرات المراقبة.",
      "TAGS: Fiber Optic, Starlink, WLAN Rehab, CCTV Security",
      "• إدخال وربط خدمات إنترنت الألياف البصرية (Fiber Optic) إلى جانب تركيب منظومات الإنترنت الفضائي (Starlink).",
      "• صيانة وتأهيل وتحديث وتشغيل منظومة شبكة الإنترنت والواي فاي (WLAN).",
      "• تحديث وصيانة منظومة الكاميرات والمراقبة الأمنية."
    ].join("\n"),
    descEn: [
      "Wi-Fi network rehabilitation, Fiber Optic & Starlink connectivity, and CCTV system maintenance.",
      "TAGS: Fiber Optic, Starlink, WLAN Rehab, CCTV Security",
      "• Integrated Fiber Optic internet services alongside Starlink satellite connectivity.",
      "• Rehabilitated, upgraded, and operated the hotel wireless network (WLAN).",
      "• Maintained and modernized the security surveillance system."
    ].join("\n"),
  },
  {
    id: "proj-alsagheer-solar",
    category: catInd,
    location: "عدن • شبوة • المخا • الخوخة",
    title: "مجموعة شركات أولاد الصغير – مشاريع محطات الطاقة الشمسية",
    titleEn: "Al-Sagheer Group – Solar Power Stations (Aden, Shabwa, Mokha, Khokha)",
    desc: [
      "تأسيس البنية التحتية للشبكات السلكية واللاسلكية وربط منظومات Starlink في مواقع محطات الطاقة الشمسية الأربع.",
      "TAGS: Solar Stations, Field LAN/WLAN, Starlink Remote Link",
      "• تأسيس وتركيب البنية التحتية للشبكات الداخلية السلكية (LAN) لغرف التحكم والمراقبة في جميع المحطات.",
      "• تجهيز ونشر شبكة الإنترنت اللاسلكية (WLAN) في المواقع الميدانية بمدن (عدن، شبوة، المخا، الخوخة).",
      "• تركيب وربط منظومات الإنترنت الفضائي (Starlink) لربط المحطات بالإدارة الهندسية ومراقبة الأداء على مدار الساعة."
    ].join("\n"),
    descEn: [
      "Field network infrastructure (LAN/WLAN) and Starlink satellite connectivity across 4 solar power stations.",
      "TAGS: Solar Stations, Field LAN/WLAN, Starlink Remote Link",
      "• Built wired LAN infrastructure for control and monitoring rooms across all station sites.",
      "• Deployed outdoor/indoor wireless networks (WLAN) in Aden, Shabwa, Mokha, and Khokha.",
      "• Installed and linked Starlink satellite systems for real-time telemetry and remote station management."
    ].join("\n"),
  },
  {
    id: "proj-alsagheer-pm",
    category: catInd,
    location: "عدن | Aden",
    title: "مجموعة شركات أولاد الصغير – إدارة المشاريع (عدن)",
    titleEn: "Al-Sagheer Group – Project Management Office (Aden)",
    desc: [
      "إعادة تأهيل منظومة الشبكة الداخلية ونظام المراقبة الأمنية وتركيب الإنترنت الفضائي Starlink.",
      "TAGS: LAN Rehab, CCTV Security, Starlink",
      "• إعادة تأهيل وتنظيم منظومة الشبكة الداخلية السلكية (LAN) لمكاتب إدارة المشاريع.",
      "• تحديث وصيانة منظومة الكاميرات والمراقبة الأمنية.",
      "• تركيب وتشغيل منظومة الإنترنت الفضائي (Starlink) لتأمين اتصال مستمر وسريع."
    ].join("\n"),
    descEn: [
      "Internal LAN rehabilitation, CCTV security system upgrade, and Starlink internet installation.",
      "TAGS: LAN Rehab, CCTV Security, Starlink",
      "• Rehabilitated and structured the internal LAN network for project management offices.",
      "• Upgraded and maintained the CCTV surveillance system.",
      "• Installed and configured Starlink satellite internet for reliable enterprise connectivity."
    ].join("\n"),
  },
  {
    id: "proj-alhalal-shipping",
    category: catInd,
    location: "عدن | Aden",
    title: "شركة الحلال للملاحة البحرية – فرع عدن",
    titleEn: "Al-Halal Maritime Shipping Co. – Aden Branch",
    desc: [
      "تأسيس وتركيب وإعادة تأهيل منظومة الشبكة الداخلية وكاميرات المراقبة الأمنية.",
      "TAGS: LAN Infrastructure, CCTV Surveillance, Maritime Office",
      "• تأسيس وتركيب وإعادة تأهيل منظومة الشبكة السلكية الداخلية (LAN) لربط أقسام الملاحة والعمليات.",
      "• تركيب وتشغيل منظومة الكاميرات والمراقبة الأمنية لتأمين المقر والمرافق."
    ].join("\n"),
    descEn: [
      "Setup and rehabilitation of internal LAN infrastructure and CCTV security surveillance.",
      "TAGS: LAN Infrastructure, CCTV Surveillance, Maritime Office",
      "• Established and rehabilitated the internal wired LAN connecting shipping and operations departments.",
      "• Installed and commissioned high-definition CCTV security cameras."
    ].join("\n"),
  },
  {
    id: "proj-aldubaee-factory",
    category: catInd,
    location: "عدن | Aden",
    title: "مصنع الدبعي للإسفنج والمراتب الجاهزة (محمد عبد الولي الدبعي)",
    titleEn: "Al-Dubaee Sponge & Mattress Factory",
    desc: [
      "تأسيس وتركيب منظومة كاميرات المراقبة الصناعية والشبكة الداخلية وربط الإنترنت الفضائي Starlink.",
      "TAGS: Industrial CCTV, LAN Network, Starlink",
      "• تأسيس وتركيب منظومة كاميرات المراقبة الأمنية لتغطية خطوط الإنتاج والمستودعات والساحات.",
      "• تمديد وتجهيز الشبكة الداخلية (LAN) للمكاتب الإدارية والمحاسبية.",
      "• تركيب وربط منظومة الإنترنت الفضائي (Starlink) بسرعة وثبات عالٍ."
    ].join("\n"),
    descEn: [
      "Industrial CCTV surveillance, internal LAN network deployment, and Starlink satellite internet connection.",
      "TAGS: Industrial CCTV, LAN Network, Starlink",
      "• Deployed industrial CCTV cameras covering production lines, warehouses, and outdoor yards.",
      "• Installed internal LAN cabling for administrative and accounting offices.",
      "• Installed and integrated Starlink satellite internet."
    ].join("\n"),
  },
  {
    id: "proj-ice-queen",
    category: catInd,
    location: "عدن | Aden",
    title: "مؤسسة الملكة للتجارة والتبريد – عدن (Ice Queen)",
    titleEn: "Ice Queen Trading & Refrigeration – Aden",
    desc: [
      "صيانة وإعادة تأهيل وتركيب منظومة كاميرات المراقبة الأمنية والشبكة الداخلية السلكية واللاسلكية.",
      "TAGS: CCTV Rehab, WLAN/LAN, Cold Storage",
      "• صيانة وإعادة تأهيل وتركيب منظومة كاميرات المراقبة الأمنية للمنشأة ومخازن التبريد.",
      "• تجهيز وتحديث الشبكة الداخلية السلكية واللاسلكية (LAN / WLAN) لضمان تغطية مستقرة."
    ].join("\n"),
    descEn: [
      "Maintenance, rehabilitation, and installation of CCTV security systems and LAN/WLAN networks.",
      "TAGS: CCTV Rehab, WLAN/LAN, Cold Storage",
      "• Maintained, rehabilitated, and installed CCTV surveillance across facilities and cold storage.",
      "• Upgraded wired and wireless internal networks (LAN / WLAN)."
    ].join("\n"),
  },
  {
    id: "proj-agf-fish",
    category: catInd,
    location: "عدن | Aden",
    title: "شركة خليج عدن لتصدير الأسماك (AGF) – عدن",
    titleEn: "Aden Gulf Fisheries Export Co. (AGF) – Aden",
    desc: [
      "إعادة تأهيل منظومة الكاميرات الأمنية والشبكة الداخلية وتركيب الإنترنت الفضائي Starlink.",
      "TAGS: CCTV Rehab, LAN Network, Starlink",
      "• إعادة تأهيل وتحديث منظومة الكاميرات والمراقبة الأمنية لمناطق التجهيز والتخزين والإدارة.",
      "• صيانة وتأهيل الشبكة الداخلية السلكية (LAN).",
      "• تركيب وتشغيل منظومة الإنترنت الفضائي (Starlink)."
    ].join("\n"),
    descEn: [
      "CCTV security rehabilitation, internal LAN upgrade, and Starlink satellite internet installation.",
      "TAGS: CCTV Rehab, LAN Network, Starlink",
      "• Rehabilitated and upgraded CCTV cameras across processing, storage, and administrative zones.",
      "• Maintained and structured the internal LAN network.",
      "• Installed and activated Starlink satellite internet."
    ].join("\n"),
  },
  {
    id: "proj-alnoor-ice",
    category: catInd,
    location: "عدن | Aden",
    title: "مصنع النور للثلوج (النور هايبر ماركت سابقاً)",
    titleEn: "Al-Noor Ice Factory (Formerly Al-Noor Hypermarket)",
    desc: [
      "إعادة تأهيل وصيانة شاملة لمنظومة الكاميرات والمراقبة الأمنية.",
      "TAGS: CCTV Rehab, Security Maintenance",
      "• فحص وصيانة وإعادة تأهيل منظومة كاميرات المراقبة الأمنية وأجهزة التسجيل لضمان عملها بكفاءة عالية على مدار الساعة."
    ].join("\n"),
    descEn: [
      "Comprehensive rehabilitation and maintenance of the CCTV security surveillance system.",
      "TAGS: CCTV Rehab, Security Maintenance",
      "• Inspected, repaired, and rehabilitated security cameras and recording units for reliable 24/7 monitoring."
    ].join("\n"),
  },
  {
    id: "proj-aden-gulf-univ",
    category: catFac,
    location: "الضالع | Al-Dhalea",
    title: "جامعة خليج عدن الدولية (Aden Gulf International University) – الضالع",
    titleEn: "Aden Gulf International University – Al-Dhalea",
    desc: [
      "تجهيز وتركيب غرفة السيرفرات والداتا سنتر، وتأسيس الشبكة السلكية واللاسلكية ومنظومة المراقبة الأمنية.",
      "TAGS: Data Center, Campus WLAN/LAN, CCTV Security",
      "• تجهيز وتركيب غرفة السيرفرات ومركز البيانات (Data Center) وفق المعايير الأكاديمية والتقنية.",
      "• تأسيس وتركيب منظومة الشبكة الداخلية السلكية واللاسلكية (LAN / WLAN) لتغطية القاعات والمكاتب.",
      "• تأسيس وتركيب منظومة كاميرات المراقبة الأمنية الشاملة للحرم الجامعي."
    ].join("\n"),
    descEn: [
      "Server room & Data Center setup, campus-wide LAN/WLAN networking, and CCTV security deployment.",
      "TAGS: Data Center, Campus WLAN/LAN, CCTV Security",
      "• Equipped and commissioned the main Server Room and Data Center.",
      "• Deployed wired and wireless networks (LAN / WLAN) across lecture halls, labs, and offices.",
      "• Installed a comprehensive campus-wide CCTV security surveillance system."
    ].join("\n"),
  },
  {
    id: "proj-pmbs-hospital",
    category: catFac,
    location: "عدن | Aden",
    title: "مستشفى الأمير محمد بن سلمان – مباني سكن الموظفين (عدن)",
    titleEn: "Prince Mohammed bin Salman Hospital – Staff Housing (Aden)",
    desc: [
      "تأسيس شبكة الواي فاي وربط منظومة Starlink، وتجهيز وتركيب شاشات التلفاز وشبكة الستلايت المركزية لجميع الشقق.",
      "TAGS: Residential Wi-Fi, Starlink, Smart TVs & Central Satellite",
      "• تأسيس وتركيب الشبكة الداخلية للإنترنت والواي فاي (Wi-Fi) لتغطية كافة مباني وشقق سكن الموظفين.",
      "• تركيب وربط منظومة الإنترنت الفضائي (Starlink) لتوفير اتصال إنترنت فائق السرعة.",
      "• تجهيز وربط وتركيب جميع شاشات التلفاز في كافة الشقق مع تركيب وتوصيل شبكة الستلايت المركزية."
    ].join("\n"),
    descEn: [
      "Internal Wi-Fi network setup, Starlink integration, and installation of TVs & central satellite system across all apartments.",
      "TAGS: Residential Wi-Fi, Starlink, Smart TVs & Central Satellite",
      "• Established internal Wi-Fi networks covering all staff housing buildings and apartments.",
      "• Installed and integrated Starlink satellite internet for high-speed connectivity.",
      "• Mounted and connected TV screens across all apartments linked to a central satellite distribution system."
    ].join("\n"),
  },
  {
    id: "proj-zafran-lounge",
    category: catFac,
    location: "مطار عدن الدولي | Aden Airport",
    title: "صالة الزعفران لكبار الزوار (Al-Zafran Lounge) – مطار عدن الدولي",
    titleEn: "Al-Zafran VIP Lounge – Aden International Airport",
    desc: [
      "تركيب منظومة شبكة الإنترنت اللاسلكي (Wi-Fi) وربط وتشغيل الإنترنت الفضائي Starlink.",
      "TAGS: VIP Wi-Fi, Starlink, Aden Airport",
      "• تركيب وتجهيز منظومة شبكة الإنترنت الداخلي اللاسلكي (Wi-Fi) لتغطية الصالة بالكامل.",
      "• ربط وتركيب منظومة الإنترنت الفضائي (Starlink) لتوفير خدمة إنترنت سريعة وموثوقة للمسافرين وكبار الزوار."
    ].join("\n"),
    descEn: [
      "Internal Wi-Fi network deployment and Starlink satellite internet integration at Aden International Airport.",
      "TAGS: VIP Wi-Fi, Starlink, Aden Airport",
      "• Installed high-performance internal Wi-Fi coverage throughout the VIP lounge.",
      "• Connected and configured Starlink satellite internet for fast, uninterrupted passenger connectivity."
    ].join("\n"),
  },
  {
    id: "proj-sahara-global",
    category: catFac,
    location: "مطار عدن الدولي | Aden Airport",
    title: "شركة صحارى جلوبل – إدارة التموين بمطار عدن الدولي",
    titleEn: "Sahara Global Co. – In-Flight Catering (Aden International Airport)",
    desc: [
      "تأسيس وتركيب وإعادة تأهيل منظومة الشبكة الداخلية (LAN) وتركيب وربط الإنترنت الفضائي Starlink.",
      "TAGS: LAN Rehab, Starlink, Airport Catering",
      "• تأسيس وتركيب وإعادة تأهيل منظومة الشبكة السلكية الداخلية (LAN) لمكاتب ومرافق إدارة التموين.",
      "• تركيب وربط منظومة الإنترنت الفضائي (Starlink) لضمان استمرارية الاتصال والعمليات التشغيلية."
    ].join("\n"),
    descEn: [
      "Internal LAN setup & rehabilitation and Starlink satellite internet integration.",
      "TAGS: LAN Rehab, Starlink, Airport Catering",
      "• Established and rehabilitated the wired LAN network for catering management offices.",
      "• Installed and linked Starlink satellite internet for reliable operational communications."
    ].join("\n"),
  },
  {
    id: "proj-alkawz-hypermarket",
    category: catFac,
    location: "عدن | Aden",
    title: "الكوز هايبر ماركت – عدن (Al-Kawz Hypermarket)",
    titleEn: "Al-Kawz Hypermarket – Aden",
    desc: [
      "صيانة وتحديث شبكة الإنترنت الداخلية والواي فاي، وربط شبكة نظام تسعير المنتجات الذكي عبر رمز QR من هاتف العميل.",
      "TAGS: LAN/WLAN Upgrade, Retail Wi-Fi, QR Smart Pricing System",
      "• صيانة وإعادة تأهيل وتحديث الشبكة الداخلية السلكية (LAN) وكبائن التوزيع.",
      "• صيانة وتحديث شبكة الإنترنت الداخلية والواي فاي (Wi-Fi / WLAN) لتغطية كافة صالات وأقسام العرض.",
      "• ربط وتأمين الشبكة لتشغيل نظام تسعير المنتجات الذكي عبر مسح رمز (QR Code) مباشرة من هاتف العميل."
    ].join("\n"),
    descEn: [
      "Maintenance and upgrade of internal LAN & Wi-Fi networks, and networking integration for customer QR mobile price checking.",
      "TAGS: LAN/WLAN Upgrade, Retail Wi-Fi, QR Smart Pricing System",
      "• Maintained, rehabilitated, and upgraded the internal wired LAN and distribution cabinets.",
      "• Upgraded internal internet and Wi-Fi (WLAN) coverage across all hypermarket aisles and departments.",
      "• Linked and configured the network infrastructure to power the smart QR Code product pricing system on customers' smartphones."
    ].join("\n"),
  },
];

db.prepare("DELETE FROM projects").run();
const insertProj = db.prepare(
  "INSERT INTO projects (id, title, title_en, category, location, description, description_en, image, sort, active) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, 1)"
);
projects.forEach((p, idx) => {
  insertProj.run(p.id, p.title, p.titleEn, p.category, p.location, p.desc, p.descEn, idx);
});

console.log("✅ تم تحديث قاعدة البيانات بنجاح: 20 مشروعاً مفصلاً باللغتين العربية والإنجليزية!");
