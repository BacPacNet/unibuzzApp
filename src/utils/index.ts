import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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

export const validateUploadedFiles = (
  files: File[],
  options: {
    maxFiles?: number;
    maxSize?: number;
  } = {}
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

export const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/jpg",
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
    default:
      return "other";
  }
};
