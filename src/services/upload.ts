import { useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/content/constant";
import RNFetchBlob from "react-native-blob-util";
import { UploadContextType } from "@/types/uploads";
import { Toast } from "react-native-toast-notifications";
import { getToken } from "@/storage/token";
import { NEXT_PUBLIC_API_BASE_URL } from "@env";
import { Platform } from "react-native";

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
  cookieValue: string
): Promise<S3UploadResponse> {
  const body: any[] = [];

  // Add files to form data
  uploadPayload.files.forEach((file, index) => {
    const filename = file.fileName || `upload_${Date.now()}_${index}.jpg`;
    const type = file.type || "image/jpeg";

    // Handle iOS file path - remove file:// prefix
    let uri = file.uri;
    if (Platform.OS === "ios" && uri.startsWith("file://")) {
      uri = uri.replace("file://", "");
    }

    // Decode URI if it's encoded
    const decodedUri = decodeURIComponent(uri);

    body.push({
      name: "files",
      filename,
      type,
      data: RNFetchBlob.wrap(decodedUri),
    });
  });

  // Add context as JSON string
  body.push({
    name: "context",
    data: JSON.stringify(uploadPayload.context),
  });

  try {
    // Check if files exist before uploading
    for (const file of uploadPayload.files) {
      let uri = file.uri;
      if (Platform.OS === "ios" && uri.startsWith("file://")) {
        uri = uri.replace("file://", "");
      }
      const decodedUri = decodeURIComponent(uri);

      const exists = await RNFetchBlob.fs.exists(decodedUri);
      if (!exists) {
        throw new Error(`File does not exist: ${decodedUri}`);
      }
    }

    const response = await RNFetchBlob.fetch(
      "POST",
      `${NEXT_PUBLIC_API_BASE_URL}/upload`,
      {
        Authorization: `Bearer ${cookieValue}`,
        "Content-Type": "multipart/form-data",
      },
      body
    );

    const result = response.json();
    return result;
  } catch (error) {
    throw error;
  }
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
