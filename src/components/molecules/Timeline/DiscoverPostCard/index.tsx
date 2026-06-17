import React, { memo, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import RenderHtml from "react-native-render-html";
import ImageGridLayout from "../../ImageGridLayout";
import PostCardUserDetails from "../PostCardUserDetails";
import { RenderCreatedAt } from "@/components/atoms/CreatedAt";
import { PostType } from "@/types/postType";
import { ContentType } from "@/types/report-content";
import {
  formatHtmlContentForCodeBlocks,
  htmlStyles,
} from "@/utils/renderHtlmStyles";

interface DiscoverPostCardProps {
  user: string;
  university: string;
  communityName?: string;
  communityGroupName?: string;
  major: string;
  adminId: string;
  year: string;
  text: string;
  date: string;
  avatarLink: string;
  communityGroupId?: string;
  postID: string;
  type: PostType.Community | PostType.Timeline;
  images: {
    imageUrl: string;
  }[];
  idx?: number;
  role?: string;
  occupation?: string;
  affiliation?: string;
  isPostVerified?: boolean;
  isCommunityAdmin?: boolean;
  communities?: {
    _id: string;
    name: string;
    logo: string;
    isVerifiedMember: boolean;
    isCommunityAdmin?: boolean;
  }[];
}

const DiscoverPostCard = memo(
  ({
    user,
    university,
    adminId,
    year,
    text,
    date,
    avatarLink,
    type,
    postID,
    images,
    major,
    role,
    occupation,
    affiliation,
    isPostVerified,
    communityName,
    communityGroupName,
    communityGroupId,
    isCommunityAdmin,
    communities,
  }: DiscoverPostCardProps) => {
    const { width } = useWindowDimensions();

    const postSourceText = useMemo(() => {
      if (type === PostType.Community && communityGroupName) {
        return `Posted in ${communityGroupName} group at ${communityName}`;
      }
      if (type === PostType.Community) {
        return `Posted from ${communityName || ""}`;
      }
      return "";
    }, [type, communityGroupId, communityGroupName, communityName]);

    const postCategory = useMemo(() => {
      if (type === PostType.Community && communityGroupName) {
        return ContentType.COMMUNITY_GROUP_POST;
      }
      if (type === PostType.Community) {
        return ContentType.COMMUNITY_POST;
      }
      return ContentType.USER_POST;
    }, [type, communityGroupId, communityGroupName, communityName]);

    const formattedText = useMemo(
      () => formatHtmlContentForCodeBlocks(text),
      [text],
    );

    const normalizedCommunities = useMemo(
      () =>
        communities?.map((community) => ({
          ...community,
          isCommunityAdmin: community.isCommunityAdmin ?? false,
        })),
      [communities],
    );

    return (
      <View style={styles.card}>
        <View style={styles.content}>
          <PostCardUserDetails
            name={user}
            year={year}
            major={major}
            degree=""
            university={university}
            affiliation={affiliation || ""}
            occupation={occupation || ""}
            role={role}
            communityName={communityName}
            communityGroupName={communityGroupName}
            dp={avatarLink}
            postId={postID}
            type={type}
            isAdmin={false}
            postAdminId={adminId}
            handleDeletePost={() => {}}
            isPostVerified={isPostVerified}
            isCommunityAdmin={isCommunityAdmin}
            isPostOptionShown={false}
            communities={normalizedCommunities}
            postType={postCategory}
          />

          {Number(text?.length) > 0 && (
            <View className="px-4">
              <RenderHtml
                contentWidth={width}
                source={{ html: formattedText }}
                tagsStyles={htmlStyles.tagsStyles}
                classesStyles={htmlStyles.classesStyles}
                ignoredDomTags={["label", "input"]}
              />
            </View>
          )}

          {images?.length > 0 ? (
            <ImageGridLayout imagesData={images} skipFileItems={true} />
          ) : null}

          <View className="px-4">
            <RenderCreatedAt date={date} postSourceText={postSourceText} />
          </View>
        </View>
      </View>
    );
  },
);

DiscoverPostCard.displayName = "DiscoverPostCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
  },
  content: {

    paddingVertical: 16,
    gap: 16,
  },
});

export default DiscoverPostCard;
