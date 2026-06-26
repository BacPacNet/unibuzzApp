import {
  CommunityGroupAccess,
  GROUP_ACCESS_TOOLTIP_CONFIG,
} from "@/types/CommunityGroup";

export const GROUP_ACCESS_OPTIONS = [
  {
    label: GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.OpenCampus].title,
    value: CommunityGroupAccess.OpenCampus,
    details:
      GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.OpenCampus].description,
  },
  {
    label: GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.UniversityWide].title,
    value: CommunityGroupAccess.UniversityWide,
    details:
      GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.UniversityWide]
        .description,
  },
  {
    label: GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.Hidden].title,
    value: CommunityGroupAccess.Hidden,
    details:
      GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.Hidden].description,
  },
];

export const GROUP_TYPE_OPTIONS = [
  {
    label: "Casual",
    value: "casual",
    details: "No approval required",
  },
  {
    label: "Official",
    value: "official",
    details: "Require university approval",
  },
];
export const GROUP_LABEL_OPTIONS = [
  {
    label: "Course",
    value: "Course",
    details: "Group for a particular academic subject",
  },
  {
    label: "Club",
    value: "Club",
    details: "Formal and competitive, often university-recognized",
  },
  {
    label: "Circle",
    value: "Circle",
    details: "Casual and interest-based",
  },
  
  {
    label: "Other",
    value: "Other",

  },
];
