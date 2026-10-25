/**
 * Local fixture test for getProjectsGroupedByYear logic (mirrors src/data/projects.ts).
 * Does not touch production data.
 */
function getProjectsGroupedByYear(published) {
  const byYear = new Map();
  for (const project of published) {
    if (!project.approvedForPublication || typeof project.year !== "number") continue;
    if (!project.images?.length || !project.equipmentModel) continue;
    const list = byYear.get(project.year) ?? [];
    list.push(project);
    byYear.set(project.year, list);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, projects]) => ({ year, projects }));
}

const fixtures = [
  {
    id: "a",
    equipmentModel: "ДЕ-16",
    year: 2026,
    approvedForPublication: true,
    images: [{ src: "/x.jpg" }],
  },
  {
    id: "b",
    equipmentModel: "КЕ-25",
    year: 2025,
    approvedForPublication: true,
    images: [{ src: "/y.jpg" }],
  },
  {
    id: "c",
    equipmentModel: "ДЕ-6",
    year: 2026,
    approvedForPublication: true,
    images: [{ src: "/z.jpg" }],
  },
  {
    id: "skip-no-year",
    equipmentModel: "X",
    approvedForPublication: true,
    images: [{ src: "/n.jpg" }],
  },
  {
    id: "skip-unpublished",
    equipmentModel: "Y",
    year: 2024,
    approvedForPublication: false,
    images: [{ src: "/m.jpg" }],
  },
];

const groups = getProjectsGroupedByYear(fixtures);
const years = groups.map((g) => g.year);
if (JSON.stringify(years) !== JSON.stringify([2026, 2025])) {
  console.error("FAIL years", years);
  process.exit(1);
}
if (groups[0].projects.length !== 2 || groups[1].projects.length !== 1) {
  console.error("FAIL counts", groups);
  process.exit(1);
}
console.log("OK grouping fixtures", years);
