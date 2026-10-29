import { useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/content/constant";
import RNFetchBlob from "react-native-blob-util";
import { UploadContextType } from "@/types/uploads";
import { Toast } from "react-native-toast-notifications";
import { getToken } from "@/storage/token";
import { NEXT_PUBLIC_API_BASE_URL } from "@env";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { forceDeauthenticate } from "@/hooks/Auth/forceDeautenticate";

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

type LocalImage = {
  uri: string;
  fileName?: string;
  type?: string;
};

type LocalFile = {
  uri: string;
  name?: string | null;
  type?: string | null;
};

export function buildUploadFiles(images: LocalImage[], files: LocalFile[]) {
  return [
    ...images.map((image) => ({
      uri: image.uri,
      fileName: image.fileName || `upload_${Date.now()}.jpg`,
      type: image.type || "image/jpeg",
    })),
    ...files.map((file) => ({
      uri: file.uri,
      fileName: file.name || `file_${Date.now()}`,
      type: file.type || "application/octet-stream",
    })),
  ];
}

export function getUploadedItems(response?: S3UploadResponse | null) {
  return (response?.data ?? []).filter((item) => item.imageUrl);
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

  body.push({
    name: "context",
    data: uploadPayload.context,
  });

  const response = await RNFetchBlob.fetch(
    "POST",
    `${NEXT_PUBLIC_API_BASE_URL}/upload`,
    {
      Authorization: `Bearer ${token}`,
      "X-Client-Type": "app",
      "X-Client-Platform": Platform.OS,
      "X-App-Version": DeviceInfo.getVersion(),
    },
    body
  );

  const status = response.info().status;
  const parsed = (await Promise.resolve(response.json())) as S3UploadResponse & {
    error?: string;
    message?: string;
  };

  if (status < 200 || status >= 300 || !parsed?.success) {
    throw new Error(
      parsed?.error || parsed?.message || "Failed to upload files"
    );
  }

  return parsed;
}

export const useUploadToS3 = () => {
  return useMutation<S3UploadResponse, Error, S3UploadRequest>({
    mutationFn: async (uploadPayload) => {
      const token = getToken();
      if (!token) {
        forceDeauthenticate();
        throw new Error("jwt expired");
      }
      return await uploadToS3WithRNFetchBlob(uploadPayload, token);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      if (message === "jwt expired" || message === "jwt malformed") {
        forceDeauthenticate();
        return;
      }
      Toast.hideAll();
      Toast.show(message || MESSAGES.SOMETHING_WENT_WRONG);
    },
  });
};
