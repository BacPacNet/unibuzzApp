import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { differenceInDays, differenceInHours, differenceInMinutes, isValid, parse } from "date-fns";
import { getUserProfileStore } from "@/storage/user";

dayjs.extend(relativeTime);
dayjs.locale("en");
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

dayjs.locale("en-short", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1s",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});
export const timeAgo = (timestamp: string) => {
  if (!timestamp?.length) return null;
  return dayjs(timestamp).fromNow();
};

export const convertToDateObj = (dateStr: string) => {
  const format = "dd/MM/yyyy";
  const parsed = parse(dateStr, format, new Date());

  return isValid(parsed) ? parsed : null;
};
export const validateUploadedFiles = (
  files: File[],
  options: {
    maxFiles?: number;
    maxSize?: number;
  } = {},
): { isValid: boolean; message: string } => {
  const {
    maxFiles = 4,
    maxSize = 5 * 1024 * 1024, // 5MB
  } = options;

  // Supported formats
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (files.length > maxFiles) {
    return { isValid: false, message: `Maximum ${maxFiles} files allowed` };
  }

  if (files.some((file) => file.size > maxSize)) {
    return { isValid: false, message: "File too large" };
  }

  if (files.some((file) => !allowedTypes.includes(file.type))) {
    return { isValid: false, message: "Invalid format" };
  }

  return { isValid: true, message: "" };
};

export const formatRelativeTime = (date: Date | string): string => {
    const givenDate = typeof date === 'string' ? new Date(date) : date
  
    const minutesDiff = differenceInMinutes(new Date(), givenDate)
    if (minutesDiff < 60) return `${minutesDiff}m`
  
    const hoursDiff = differenceInHours(new Date(), givenDate)
    if (hoursDiff < 24) return `${hoursDiff}h`
  
    const daysDiff = differenceInDays(new Date(), givenDate)
    return `${daysDiff}d`
  }
  
  export const truncateStringTo = (str: string, num: number): string => {
    if (str.length <= num) return str
    return str.slice(0, num) + '...'
  }

export const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/jpg",
  "image/gif",
];

export const getMimeTypeFromUrl = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "gif":
      return "image/gif";
    default:
      return "other";
  }
};

export const IsUniversityVerified = (): boolean => {
  const userProfileData = getUserProfileStore();
  return (
    userProfileData?.email?.some(
      (university) =>
        university.UniversityName === userProfileData.university_name,
    ) || false
  );
};
