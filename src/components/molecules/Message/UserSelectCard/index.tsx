import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "@/assets/avatarPlaceholder.png";
import { Users } from "@/types/connections";
import { Xmark } from "iconoir-react-native";
import { getUserProfileSubtitleLines } from "@/lib/userProfileSubtitle";

type Props = {
  item: Users;
  selectedUsers: Users[];
  setSelectedUsers: (value: Users | Users[]) => void;
  handleUserSelect?: (value: Users) => void;
  handleRemoveUser?: () => void;
  isRemoveAllowed?: boolean;
  isBottomBorder?: boolean;
};

export const UserSelectCard = ({
  item,
  selectedUsers,
  setSelectedUsers,
  handleUserSelect,
  isRemoveAllowed,
  handleRemoveUser,
  isBottomBorder = true,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = item?.profile?.profile_dp?.imageUrl;

  const isSelected = selectedUsers?.some(
    (selectedUser: any) => selectedUser._id == item._id
  );

  const { line1, line2 } = getUserProfileSubtitleLines({
    role: item?.profile?.role,
    study_year: item?.profile?.study_year,
    major: item?.profile?.major,
    occupation: item?.profile?.occupation,
    affiliation: item?.profile?.affiliation,
  });

  const handleClick = () => {
    if (handleUserSelect) {
      return handleUserSelect(item);
    }
    if (isSelected) {
      // Handle deselection
      if (Array.isArray(selectedUsers)) {
        setSelectedUsers(selectedUsers.filter((u: any) => u._id !== item._id));
      } else {
        setSelectedUsers([]);
      }
    } else {
      // Handle selection
      if (Array.isArray(selectedUsers)) {
        setSelectedUsers([...selectedUsers, item]);
      } else {
        setSelectedUsers(item);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={{ ...(isBottomBorder ? { paddingHorizontal: 0 } : {}) }}
      className={`flex flex-row justify-between py-4   ${isBottomBorder ? "border-b border-neutral-200" : ""}`}
    >
      <View className="flex-1 flex-row items-center gap-4 justify-center">
        <View>
          <Image
            source={!imageError && imageUri ? { uri: imageUri } : avatar}
            style={{ width: 52, height: 52 }}
            className="rounded-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>

        <View
          style={styles.infoContainer}
          className="flex-1 flex-row items-center"
        >
          <View className="flex-1">
            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <View>
              {line1 ? <Text style={styles.info}>{line1}</Text> : null}
              {line2 ? <Text style={styles.info}>{line2}</Text> : null}
            </View>
          </View>
        </View>
      </View>
      {isRemoveAllowed ? (
        <View className="flex-row items-center justify-center">
          <TouchableOpacity onPress={() => handleRemoveUser?.()}>
            <Text className="text-neutral-500">
              <Xmark width={20} height={20} />
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3A3B3C",
  },
  info: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "400",
  },
  infoContainer: {
    gap: 16,
  },
});
