import { StyleSheet, View } from "react-native";
import DropdownWrapper from "../../SelectDropDownWrapper";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { NavArrowDown } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";
import { AllFiltersCommunityGroupPost } from "@/types/CommunityGroup";
import CommunityGroupPostFilterDropdownOptions from "../CommunityGroupPostFilterDropdownOptions";

type CommunityGroupPostFilterDropDownProps = {
  setFilterPostBy: (filter: string) => void;
  filterPostBy: string;
  pendingPostCount: number;
};

export const CommunityGroupPostFilter = ({
  setFilterPostBy,
  filterPostBy,
  pendingPostCount,
}: CommunityGroupPostFilterDropDownProps) => {
  return (
    <View style={styles.container}>
      <DropdownWrapper
        position="bottom"
        extraBottom={-40}
        viewLeftPosition={2}
        renderDropdown={(closeDropdown) => (
          <CommunityGroupPostFilterDropdownOptions
            pendingPostCount={pendingPostCount}
            setFilterBy={setFilterPostBy}
          />
        )}
      >
        <TouchableOpacity style={styles.dropDown}>
          <View>
            <Text style={styles.dropDownText}>
              {filterPostBy?.length > 0
                ? AllFiltersCommunityGroupPost[
                    filterPostBy as keyof typeof AllFiltersCommunityGroupPost
                  ]
                : AllFiltersCommunityGroupPost["allPosts"]}
            </Text>
          </View>
          <View className="flex flex-row gap-1 items-center">
            {pendingPostCount > 0 && (
              <View
                style={styles.pendingPostCount}
                className="bg-destructive-600  rounded-full flex items-center justify-center"
              >
                <Text className="text-white text-2xs font-semibold">
                  {pendingPostCount}
                </Text>
              </View>
            )}

            <NavArrowDown
              height={20}
              width={20}
              color={"#242526"}
              strokeWidth={2}
            />
          </View>
        </TouchableOpacity>
      </DropdownWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginStart: 16,
  },
  dropDown: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    minWidth: 135,
    maxWidth: 160,
  },
  dropDownText: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: "#3A3B3C",
  },
  pendingPostCount: {
    width: 20,
    height: 20,
  },
});
