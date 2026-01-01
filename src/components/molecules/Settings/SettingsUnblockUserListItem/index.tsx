import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "@/assets/avatar.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useNavigation } from "@react-navigation/native";

interface SettingsUnblockUserListItemProps {
  firstName: string;
  lastName: string;
  id: string;
  university: string;
  study_year: string;
  degree: string;
  major: string;
  occupation: string;
  imageUrl: string;
  type: string;
  role: string;
  affiliation: string;
  handleRemoveClick?: (id: string) => void;
  isRemovePending?: boolean;
}

const SettingsUnblockUserListItem: React.FC<
  SettingsUnblockUserListItemProps
> = ({
  id,
  firstName,
  lastName,
  study_year,
  major,
  occupation,
  role,
  affiliation,
  imageUrl,
  handleRemoveClick,
  isRemovePending = false,
}) => {
  const navigation = useNavigation() as any;
  const [imgError, setImgError] = useState(false);

  const isStudent = role === "student";

  const handleProfileClick = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: id },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.leftSection}
        onPress={handleProfileClick}
        activeOpacity={0.7}
      >
        <View style={styles.avatarWrapper}>
          {imageUrl && !imgError ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatar}
              onError={() => setImgError(true)}
            />
          ) : (
            <Avatar width={48} height={48} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>

          {(study_year || occupation) && (
            <Text style={styles.metaText}>
              {isStudent ? study_year : occupation}
            </Text>
          )}

          {(major || affiliation) && (
            <Text style={styles.metaText}>
              {isStudent ? major : affiliation}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <ReusableButton
        variant="danger"
        buttonText="Unblock User"
        height="small"
        size={110}
        onPress={() => handleRemoveClick?.(id)}
        disabled={isRemovePending}
        isLoading={isRemovePending}
      />
    </View>
  );
};

export default SettingsUnblockUserListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  infoContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    lineHeight: 14,
  },
  metaText: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
  },
});
