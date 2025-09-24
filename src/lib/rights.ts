export interface ForestRight {
  title: string;
  section: string;
  description: string;
  details: string[];
}

export const forestRights: ForestRight[] = [
  {
    title: "Title Rights",
    section: "Section 3(1)(a)",
    description: "Right to hold and live in the forest land under the individual or common occupation for habitation or for self-cultivation for livelihood.",
    details: [
      "Provides security of tenure over land that has been occupied for generations.",
      "The land cannot be sold or transferred, except through inheritance.",
      "Maximum limit of 4 hectares per nuclear family.",
    ],
  },
  {
    title: "Use Rights",
    section: "Section 3(1)(c)",
    description: "Right of ownership, access to collect, use, and dispose of minor forest produce which has been traditionally collected within or outside village boundaries.",
    details: [
      "Includes bamboo, brush wood, stumps, cane, tussar, cocoons, honey, wax, lac, tendu leaves, medicinal plants and herbs, roots, tubers, etc.",
      "Empowers Gram Sabha to issue transit passes for transporting minor forest produce.",
    ],
  },
  {
    title: "Community Forest Resource Rights",
    section: "Section 3(1)(i)",
    description: "Right to protect, regenerate or conserve or manage any community forest resource which they have been traditionally protecting and conserving for sustainable use.",
    details: [
      "Allows communities to formulate their own rules for forest use.",
      "Aims to decentralize forest governance and empower local communities.",
      "Recognizes the traditional and customary knowledge of forest dwellers in conservation.",
    ],
  },
  {
    title: "Relief and Development Rights",
    section: "Section 3(1)(e)",
    description: "Rights in case of illegal eviction or displacement, including rehabilitation before eviction and basic amenities.",
    details: [
      "No member of a forest dwelling community shall be evicted until the recognition and verification procedure is complete.",
      "Ensures that development projects do not violate the rights of forest dwellers.",
    ],
  },
  {
    title: "Habitat Rights",
    section: "Section 3(1)(d)",
    description: "Rights of habitat and habitation for primitive tribal groups and pre-agricultural communities.",
    details: [
      "Recognizes the customary territories and cultural practices of particularly vulnerable tribal groups (PVTGs).",
      "Aims to protect their unique way of life and traditional ecological knowledge.",
    ],
  },
];