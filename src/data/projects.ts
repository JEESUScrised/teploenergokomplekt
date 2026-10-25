/**
 * Project portfolio — single source of truth.
 *
 * Publishing rules:
 * - Chronology on the homepage shows only `approvedForPublication` items
 *   with a confirmed numeric `year`, equipment label, and at least one image.
 * - Years/cities taken only from filenames are stored as provisional metadata
 *   (`source: "filename"`) and must stay unpublished until the client confirms.
 * - Client brief examples (ДЕ-16 Бузулук 2026, etc.) are format samples, not
 *   automatic approval — even when a matching file exists.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  aspect?: "wide" | "tall" | "square";
};

export type ProjectSource = "filename" | "client-confirmed" | "unknown";

export type Project = {
  id: string;
  title: string;
  equipmentModel: string;
  city?: string;
  region?: string;
  /** Confirmed completion year only when approved; may be set provisionally with source:"filename". */
  year?: number;
  description?: string;
  images: ProjectImage[];
  approvedForPublication: boolean;
  /** How location/year were obtained */
  source: ProjectSource;
};

/** Flat slide for marquee / lightbox consumers (About, Service pages). */
export type GallerySlide = {
  id: string;
  src: string;
  alt: string;
  equipment: string;
  location: string;
  year: string;
  caption: string;
  aspect?: "wide" | "tall" | "square";
};

export type ProjectYearGroup = {
  year: number;
  projects: Project[];
};

export const projectsSectionCopy = {
  eyebrow: "Портфолио",
  title: "Объекты / выполненные работы",
  lead: "Фотографии выполненных работ на промышленных объектах. Проекты представлены по годам с указанием оборудования и местоположения.",
  empty:
    "Каталог объектов готовится к публикации. После подтверждения заказчиком состава проектов, годов и подписей работы появятся здесь в хронологическом порядке.",
} as const;

/**
 * Full catalog. Multi-photo files for the same object are merged.
 * All entries start unpublished pending client confirmation of years/locations.
 */
export const projects: Project[] = [
  // —— HQ / generic site photography (no confirmed object metadata) ——
  {
    id: "hq-boiler-row-gas",
    title: "Котельная — газовая обвязка",
    equipmentModel: "Котельная",
    images: [
      {
        src: "/assets/projects/hq-boiler-row-gas.jpg",
        alt: "Ряд промышленных котлов с газовой обвязкой",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-boiler-blue-green",
    title: "Котлоагрегат с трубопроводами",
    equipmentModel: "Котлоагрегат",
    images: [
      {
        src: "/assets/projects/hq-boiler-blue-green.jpg",
        alt: "Промышленный котёл с трубопроводами",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-heatex-copper-tubes",
    title: "Поверхности нагрева",
    equipmentModel: "Поверхности нагрева",
    images: [
      {
        src: "/assets/projects/hq-heatex-copper-tubes.jpg",
        alt: "Открытые поверхности нагрева котла",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-welder-boiler",
    title: "Сварочные работы на котле",
    equipmentModel: "Сварочные работы",
    images: [
      {
        src: "/assets/projects/hq-welder-boiler.jpg",
        alt: "Сварка на котельном оборудовании",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-grinder-sparks",
    title: "Ремонтные работы",
    equipmentModel: "Ремонтные работы",
    images: [
      {
        src: "/assets/projects/hq-grinder-sparks.jpg",
        alt: "Механическая обработка на котле",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-techs-water-tubes",
    title: "Обследование трубной системы",
    equipmentModel: "Обследование",
    images: [
      {
        src: "/assets/projects/hq-techs-water-tubes.jpg",
        alt: "Специалисты на обследовании котла",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-boiler-yellow-pipes",
    title: "Газовая обвязка котла",
    equipmentModel: "Газовая обвязка",
    images: [
      {
        src: "/assets/projects/hq-boiler-yellow-pipes.jpg",
        alt: "Котёл с жёлтыми газовыми трубопроводами",
        aspect: "square",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-boiler-red-plate",
    title: "Котлоагрегат — площадка обслуживания",
    equipmentModel: "Котлоагрегат",
    images: [
      {
        src: "/assets/projects/hq-boiler-red-plate.jpg",
        alt: "Котельное оборудование с площадкой обслуживания",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-heatex-ladder",
    title: "Теплообменные поверхности",
    equipmentModel: "Теплообменные поверхности",
    images: [
      {
        src: "/assets/projects/hq-heatex-ladder.jpg",
        alt: "Теплообменный блок котла",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "hq-pipes-yellow-network",
    title: "Трубопроводы котельной",
    equipmentModel: "Трубопроводы",
    images: [
      {
        src: "/assets/projects/hq-pipes-yellow-network.jpg",
        alt: "Сеть трубопроводов котельной",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "boiler-room-line",
    title: "Котельная — линия оборудования",
    equipmentModel: "Котельная",
    images: [
      {
        src: "/assets/projects/boiler-room-line.jpg",
        alt: "Линия котельного оборудования в помещении",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "boiler-room-red-unit",
    title: "Котельная — красный агрегат",
    equipmentModel: "Котельная",
    images: [
      {
        src: "/assets/projects/boiler-room-red-unit.jpg",
        alt: "Котельный агрегат с красной окраской",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },
  {
    id: "boiler-room-twin-units",
    title: "Котельная — два агрегата",
    equipmentModel: "Котельная",
    images: [
      {
        src: "/assets/projects/boiler-room-twin-units.jpg",
        alt: "Два котлоагрегата в машинном зале",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "unknown",
  },

  // —— Filename-derived object candidates (pending client confirmation) ——
  {
    id: "de-16-buzuluk-2026",
    title: "Котёл ДЕ-16 — Бузулук",
    equipmentModel: "ДЕ-16",
    city: "Бузулук",
    region: "Оренбургская область",
    year: 2026,
    images: [
      {
        src: "/assets/projects/de-16-buzuluk-2026.jpg",
        alt: "Котёл ДЕ-16, снимок с объекта (файл: Бузулук, 2026)",
        aspect: "wide",
      },
      {
        src: "/assets/projects/de-16-buzuluk-2026-2.jpg",
        alt: "Котёл ДЕ-16, дополнительный вид (файл: Бузулук, 2026)",
        aspect: "square",
      },
      {
        src: "/assets/projects/de-16-buzuluk-2026-3.jpg",
        alt: "Котёл ДЕ-16, третий вид (файл: Бузулук, 2026)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "ke-25-kurgan-2025",
    title: "Котёл КЕ-25 — Курган",
    equipmentModel: "КЕ-25",
    city: "Курган",
    year: 2025,
    images: [
      {
        src: "/assets/projects/ke-25-kurgan-2025.jpg",
        alt: "Котёл КЕ-25, снимок с объекта (файл: Курган, 2025)",
        aspect: "tall",
      },
      {
        src: "/assets/projects/ke-25-kurgan-2025-2.jpeg",
        alt: "Котёл КЕ-25, дополнительный вид (файл: Курган, 2025)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "kvgm-10-150-krasnogvardeets-2026",
    title: "Котёл КВГМ-10-150 — Красногвардеец",
    equipmentModel: "КВГМ-10-150",
    city: "Красногвардеец",
    year: 2026,
    images: [
      {
        src: "/assets/projects/kvgm-10-150-krasnogvardeets-2026.jpg",
        alt: "Котёл КВГМ-10-150 (файл: Красногвардеец, 2026)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "kvgm-10-150-krasnogvardeets-2025",
    title: "Котёл КВГМ-10-150 — Красногвардеец",
    equipmentModel: "КВГМ-10-150",
    city: "Красногвардеец",
    year: 2025,
    images: [
      {
        src: "/assets/projects/kvgm-10-150-krasnogvardeets-2025.jpg",
        alt: "Котёл КВГМ-10-150 (файл: Красногвардеец, 2025)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "de-6-volgograd-2024",
    title: "Котёл ДЕ-6 — Волгоград",
    equipmentModel: "ДЕ-6",
    city: "Волгоград",
    year: 2024,
    images: [
      {
        src: "/assets/projects/de-6-volgograd-2024.jpg",
        alt: "Котёл ДЕ-6 (файл: Волгоград, 2024)",
        aspect: "square",
      },
      {
        src: "/assets/projects/de-6-volgograd-2024-2.jpeg",
        alt: "Котёл ДЕ-6, дополнительный вид (файл: Волгоград, 2024)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "ke-25-achinsk-2025",
    title: "Котёл КЕ-25 — Ачинск",
    equipmentModel: "КЕ-25",
    city: "Ачинск",
    region: "Красноярский край",
    year: 2025,
    images: [
      {
        src: "/assets/projects/ke-25-achinsk-2025.jpg",
        alt: "Котёл КЕ-25 (файл: Ачинск, 2025)",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "de-10-verhniy-baskunchak-2024",
    title: "Котёл ДЕ-10 — Верхний Баскунчак",
    equipmentModel: "ДЕ-10",
    city: "Верхний Баскунчак",
    year: 2024,
    images: [
      {
        src: "/assets/projects/de-10-verhniy-baskunchak-2024.jpeg",
        alt: "Котёл ДЕ-10 (файл: Верхний Баскунчак, 2024)",
        aspect: "wide",
      },
      {
        src: "/assets/projects/de-10-verhniy-baskunchak-2024-2.jpeg",
        alt: "Котёл ДЕ-10, дополнительный вид (файл: Верхний Баскунчак, 2024)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "de-4-14-kirov-2025",
    title: "Котёл ДЕ-4-14 — Киров",
    equipmentModel: "ДЕ-4-14",
    city: "Киров",
    year: 2025,
    images: [
      {
        src: "/assets/projects/de-4-14-kirov-2025.jpeg",
        alt: "Котёл ДЕ-4-14 (файл: Киров, 2025)",
        aspect: "square",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "dev-4-serov-2024",
    title: "Котёл ДЕВ-4 — Серов",
    equipmentModel: "ДЕВ-4",
    city: "Серов",
    year: 2024,
    images: [
      {
        src: "/assets/projects/dev-4-serov-2024.jpg",
        alt: "Котёл ДЕВ-4 (файл: Серов, 2024)",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "de-25-sennoy-2024",
    title: "Котёл ДЕ-25 — Сенной",
    equipmentModel: "ДЕ-25",
    city: "Сенной",
    year: 2024,
    description: "По имени файла — автоматизация.",
    images: [
      {
        src: "/assets/projects/de-25-automation-sennoy-2024.jpeg",
        alt: "Котёл ДЕ-25, автоматизация (файл: Сенной, 2024)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "kva-rostov-2025",
    title: "Котёл КВА-1,0 ГЖ — Ростов-на-Дону",
    equipmentModel: "КВА-1,0 ГЖ",
    city: "Ростов-на-Дону",
    year: 2025,
    images: [
      {
        src: "/assets/projects/kva-1-0-gzh-rostov-2025.jpeg",
        alt: "Котёл КВА-1,0 ГЖ (файл: Ростов-на-Дону, 2025)",
        aspect: "square",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "deaerator-tyumen-2024",
    title: "Деаэратор — Тюмень",
    equipmentModel: "Деаэратор",
    city: "Тюмень",
    year: 2024,
    description: "По имени файла — автоматизация.",
    images: [
      {
        src: "/assets/projects/deaerator-automation-tyumen-2024.jpg",
        alt: "Деаэратор, автоматизация (файл: Тюмень, 2024)",
        aspect: "wide",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
  {
    id: "economizer-tyumen-2024",
    title: "Экономайзер — Тюмень",
    equipmentModel: "Экономайзер",
    city: "Тюмень",
    year: 2024,
    images: [
      {
        src: "/assets/projects/economizer-tyumen-2024.jpg",
        alt: "Экономайзер (файл: Тюмень, 2024)",
        aspect: "tall",
      },
    ],
    approvedForPublication: false,
    source: "filename",
  },
];

export function formatProjectCaption(project: Project): string {
  const parts = [
    project.equipmentModel,
    project.city,
    project.region,
    project.year ? String(project.year) : undefined,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function getPublishedProjects(): Project[] {
  return projects.filter(
    (p) =>
      p.approvedForPublication &&
      typeof p.year === "number" &&
      Number.isFinite(p.year) &&
      p.equipmentModel.trim().length > 0 &&
      p.images.length > 0,
  );
}

export function hasPublishedProjects(): boolean {
  return getPublishedProjects().length > 0;
}

/** Group published projects by year, newest first. Does not mutate `projects`. */
export function getProjectsGroupedByYear(): ProjectYearGroup[] {
  const published = getPublishedProjects();
  const byYear = new Map<number, Project[]>();

  for (const project of published) {
    const year = project.year as number;
    const list = byYear.get(year);
    if (list) list.push(project);
    else byYear.set(year, [project]);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({
      year,
      projects: items,
    }));
}

/**
 * Local design-preview only: group real repository photos that already have a
 * numeric year, WITHOUT reading or changing `approvedForPublication`.
 * Must never be used for the public homepage chronology.
 */
export function getDesignPreviewProjectsGroupedByYear(): ProjectYearGroup[] {
  const candidates = projects.filter(
    (p) =>
      typeof p.year === "number" &&
      Number.isFinite(p.year) &&
      p.equipmentModel.trim().length > 0 &&
      p.images.length > 0,
  );
  const byYear = new Map<number, Project[]>();
  for (const project of candidates) {
    const year = project.year as number;
    const list = byYear.get(year);
    if (list) list.push(project);
    else byYear.set(year, [project]);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, projects: items }));
}

/** Flatten project images for marquees (About / Service pages). */
export function toGallerySlides(list: Project[]): GallerySlide[] {
  const slides: GallerySlide[] = [];
  for (const project of list) {
    project.images.forEach((image, index) => {
      slides.push({
        id: `${project.id}-${index}`,
        src: image.src,
        alt: image.alt,
        equipment: project.equipmentModel,
        location: [project.city, project.region].filter(Boolean).join(", "),
        year: project.approvedForPublication && project.year ? String(project.year) : "",
        caption: project.approvedForPublication
          ? formatProjectCaption(project)
          : project.equipmentModel,
        aspect: image.aspect,
      });
    });
  }
  return slides;
}

export function projectsForTags(tags?: string[]): GallerySlide[] {
  if (!tags?.length) {
    return toGallerySlides(projects).slice(0, 8);
  }
  const matched = projects.filter((p) =>
    tags.some((tag) => p.id.includes(tag) || p.images.some((img) => img.src.includes(tag))),
  );
  const slides = toGallerySlides(matched.length >= 2 ? matched : projects);
  return slides.slice(0, 8);
}
