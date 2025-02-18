import axios, { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import {
  NEXT_PUBLIC_preset_key,
  NEXT_PUBLIC_cloudName,
  NEXT_PUBLIC_Api,
  NEXT_PUBLIC_Api_Secret,
} from "@env";

export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
}

const presetKey: any = NEXT_PUBLIC_preset_key;
const cloudName = NEXT_PUBLIC_cloudName;
const APIKEY = NEXT_PUBLIC_Api;
const apiSecret = NEXT_PUBLIC_Api_Secret;

// generate the signature
function generateSignature(publicId: any) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = CryptoJS.SHA1(toSign).toString();

  return { signature, timestamp };
}

// delete the previous image
async function deletePreviousImage(publicId: any) {
  try {
    const { signature, timestamp } = generateSignature(publicId);

    await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        public_id: publicId,
        api_key: APIKEY,
        timestamp: timestamp,
        signature: signature,
      }
    );
  } catch (err) {
    console.log("Error deleting previous image", err);
  }
}

export async function uploadNewImage(img: {
  uri: string;
  type: string;
  name: string;
}) {
  const formData = new FormData();
  formData.append("file", {
    uri: img.uri,
    type: img.type || "image/jpeg", // Default to JPEG if type is missing
    name: img.name || "upload.jpg",
  } as any); // React Native requires this cast

  formData.append("upload_preset", presetKey);

  console.log("Cloud Name:", cloudName, "Form Data:", formData);

  try {
    const res: AxiosResponse<CloudinaryResponse, any> = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res?.data?.secure_url) {
      const imageUrl = res.data.secure_url;
      const publicId = res.data.public_id;
      console.log("ima", imageUrl, "pu", publicId);

      return { imageUrl: imageUrl, publicId: publicId };
    }
  } catch (err) {
    console.log("Error uploading new image", err);
  }
}

export async function replaceImage(img: any, previousImagePublicId: any) {
  if (previousImagePublicId) {
    await deletePreviousImage(previousImagePublicId);
  }
  const data = await uploadNewImage(img);
  return data;
}
