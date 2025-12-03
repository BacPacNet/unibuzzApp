import { useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/content/constant";
import RNFetchBlob from "react-native-blob-util";
import { UploadContextType } from "@/types/uploads";
import { Toast } from "react-native-toast-notifications";
import { getToken } from "@/storage/token";
import { NEXT_PUBLIC_API_BASE_URL } from "@env";
import { Platform } from "react-native";

export async function resolveFilePath(uri: string, fileName: string) {
  // iOS works with file:// directly
  if (Platform.OS === "ios") {
    return uri.replace("file://", "");
  }

  try {
    // Try stat() – works for some Android Uris
    const stat = await RNFetchBlob.fs.stat(uri);
    if (stat && stat.path) return stat.path;
  } catch (e) {
    // ignore – will fallback
  }

  // Fallback for SAF content:// Uris → copy to cache
  const cachePath = `${RNFetchBlob.fs.dirs.CacheDir}/${fileName}`;

  const base64Data = await RNFetchBlob.fs.readFile(uri, "base64");
  await RNFetchBlob.fs.writeFile(cachePath, base64Data, "base64");

  return cachePath;
}

export interface S3UploadItem {
  imageUrl: string | null;
  publicId: string | null;
}

export interface S3UploadResponse {
  success: boolean;
  data: S3UploadItem[];
}

export interface S3UploadRequest {
  files: any[];
  context: UploadContextType;
}

async function uploadToS3WithRNFetchBlob(
  uploadPayload: S3UploadRequest,
  token: string
): Promise<S3UploadResponse> {
  const body: any[] = [];

  for (const file of uploadPayload.files) {
    const filename = file.fileName || `file_${Date.now()}`;
    const mimeType = file.type || "application/octet-stream";

    const path = await resolveFilePath(file.uri, filename);

    body.push({
      name: "files",
      filename,
      type: mimeType,
      data: RNFetchBlob.wrap(path),
    });
  }

  // Add context field
  body.push({
    name: "context",
    data: JSON.stringify(uploadPayload.context),
  });

  const response = await RNFetchBlob.fetch(
    "POST",
    `${NEXT_PUBLIC_API_BASE_URL}/upload`,
    {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body
  );

  return response.json();
}

export const useUploadToS3 = () => {
  const cookieValue = getToken() as string;

  return useMutation<S3UploadResponse, Error, S3UploadRequest>({
    mutationFn: async (uploadPayload) => {
      return await uploadToS3WithRNFetchBlob(uploadPayload, cookieValue);
    },
    onSuccess: () => {},
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(
        error.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG
      );
    },
  });
};
