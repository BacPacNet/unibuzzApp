import { useCallback } from "react";
import { Share, Platform } from "react-native";
import { Toast } from "react-native-toast-notifications";

export interface UseReferralShareOptions {
  referralCode: string;
  downloadUrl?: string;
  iosAppStoreUrl?: string;
  androidPlayStoreUrl?: string;
  customMessage?: string;
}

export interface UseReferralShareReturn {
  shareReferral: () => Promise<void>;
  getReferralMessage: () => string;
}

// Default store URLs
const DEFAULT_IOS_APP_STORE_URL =
  "https://apps.apple.com/in/app/unibuzz-app/id6751199821";
const DEFAULT_ANDROID_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.unibuzzapp";

/**
 * Custom hook for sharing referral messages via native share sheet
 * Automatically detects platform (iOS/Android) and uses appropriate store URL
 * @param options - Configuration options for referral sharing
 * @returns Object containing share function and message generator
 */

export const useReferralShare = (
  options: UseReferralShareOptions
): UseReferralShareReturn => {
  const {
    referralCode,
    downloadUrl,
    iosAppStoreUrl = DEFAULT_IOS_APP_STORE_URL,
    androidPlayStoreUrl = DEFAULT_ANDROID_PLAY_STORE_URL,
    customMessage,
  } = options;

  // Determine the appropriate download URL based on platform
  const getDownloadUrl = useCallback((): string => {
    if (downloadUrl) {
      return downloadUrl;
    }
    return Platform.OS === "ios" ? iosAppStoreUrl : androidPlayStoreUrl;
  }, [downloadUrl, iosAppStoreUrl, androidPlayStoreUrl]);

  /**
   * Generates the referral message template
   */
  const getReferralMessage = useCallback((): string => {
    if (customMessage) {
      return customMessage.replace(/{REFERRAL_CODE}/g, referralCode);
    }

    const storeUrl = getDownloadUrl();

    return `Hey! 👋

    I am using Unibuzz to stay connected with people from my university.

    Use my referral code: ${referralCode} while signing up.

    Download Unibuzz here:
    ${storeUrl}`;
  }, [referralCode, customMessage, getDownloadUrl]);

  /**
   * Opens native share sheet with referral message
   */
  const shareReferral = useCallback(async (): Promise<void> => {
    try {
      const message = getReferralMessage();
      const result = await Share.share({
        message,
        // Optional: You can add url for iOS (it will be extracted automatically)
        // For now, keeping it simple and using message only
      });

      // Handle share cancellation (iOS returns action: Share.dismissedAction)
      if (result.action === Share.dismissedAction) {
        // User dismissed the share sheet - no error needed
        return;
      }
    } catch (error: any) {
      // Handle errors gracefully
      const errorMessage =
        error?.message || "Failed to share referral. Please try again.";

      // Only show error if user didn't cancel the share
      if (errorMessage !== "User did not share") {
        Toast.show(errorMessage, { type: "error" });
      }
    }
  }, [getReferralMessage]);

  return {
    shareReferral,
    getReferralMessage,
  };
};
