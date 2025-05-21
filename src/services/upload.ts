import { useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/content/constant";
import RNFetchBlob from "react-native-blob-util";
import { UploadContextType } from "@/types/Uploads";
import { Toast } from "react-native-toast-notifications";
import { getToken } from "@/storage/token";

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

  uploadPayload.files.forEach((file) => {
    const filename = file.fileName || `upload_${Date.now()}.jpg`;
    const type = file.type || "image/jpeg";
    const uri = file.uri;

    body.push({
      name: "files",
      filename,
      type,
      data: RNFetchBlob.wrap(uri),
    });
  });

  body.push({
    name: "context",
    data: uploadPayload.context,
  });

  try {
    const response = await RNFetchBlob.fetch(
      "POST",
      "http://10.0.2.2:8000/v1/upload",
      {
        Authorization: `Bearer ${cookieValue}`,
        "Content-Type": "multipart/form-data",
      },
      body
    );

    return response.json();
  } catch (error) {
    console.error("Upload Error:", error);
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
      console.log("Upload Error:", error.response?.data || error.message);
      Toast.show(
        error.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG
      );
    },
  });
};
