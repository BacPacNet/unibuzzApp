import { storage } from "@/App";
import { Community } from "@/types/Community";

enum StorageKeys {
  SELECTED_COMMUNITY_GROUP_ID = "selectedCommunityGroupId",
}

export const storeSelectedCommunityGroup = async (
  selectedCommunityGroupId: string,
  selectedCommunityGroupLogo: string
) => {
  try {
    storage.set(
      StorageKeys.SELECTED_COMMUNITY_GROUP_ID,
      JSON.stringify({ selectedCommunityGroupId, selectedCommunityGroupLogo })
    );
  } catch (error) {
    // Handle error
    console.error("Failed to save selected community group id", error);
  }
};

export const getSelectedCommunityGroup = (): {
  selectedCommunityGroupId: string;
  selectedCommunityGroupLogo: string;
} | null => {
  try {
    const selectedCommunityGroup = storage.getString(
      StorageKeys.SELECTED_COMMUNITY_GROUP_ID
    );
    if (!selectedCommunityGroup) {
      return null;
    }
    return JSON.parse(selectedCommunityGroup);
  } catch (error) {
    // Handle error
    console.error("Failed to retrieve selected community group id", error);
    return null;
  }
};
