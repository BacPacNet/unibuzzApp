import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";
import { useCreateCommunityGroup } from "@/services/community-group";
import { useUploadToS3 } from "@/services/upload";
import { CreateCommunityGroupType } from "@/types/CommunityGroup";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { ImageAsset } from "./useImageUpload";

export const useGroupCreation = (
  communityId: string,
  communityData: any,
  isCommunityAdmin: boolean
) => {
  const { createSelectedFilters, setCreateSelectedFilters } =
    useCommunityFilterContext();
  const { mutateAsync: createGroup, isPending } =
    useCreateCommunityGroup(isCommunityAdmin);
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { selectedUsersState } = useNewCommunityGroupStatesContext();

  const uploadImage = async (
    imageAsset: ImageAsset,
    context: UPLOAD_CONTEXT
  ) => {
    const uploadPayload = {
      files: [imageAsset],
      context,
    };
    return await uploadToS3(uploadPayload);
  };

  const handleCreateGroup = async (
    data: CreateCommunityGroupType,
    imageToUpload: ImageAsset | null,
    bannerToUpload: ImageAsset | null
  ) => {
    let logoImageData;
    let coverImageData;

    if (bannerToUpload) {
      coverImageData = await uploadImage(bannerToUpload, UPLOAD_CONTEXT.DP);
    }

    if (imageToUpload) {
      logoImageData = await uploadImage(imageToUpload, UPLOAD_CONTEXT.COVER_DP);
    }

    const communityGroupCategory = {
      communityGroupCategory: createSelectedFilters,
    };

    const payload = {
      ...data,
      ...communityGroupCategory,
      selectedUsers: selectedUsersState,
      communityGroupLogoUrl: logoImageData?.data[0],
      communityGroupLogoCoverUrl: coverImageData?.data[0],
      universityAdminId: communityData?.adminId,
    };

    return { payload, createGroup, setCreateSelectedFilters };
  };

  return {
    createSelectedFilters,
    setCreateSelectedFilters,
    isPending,
    selectedUsersState,
    handleCreateGroup,
  };
};
