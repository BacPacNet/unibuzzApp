import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Controller } from "react-hook-form";
import { NavArrowDown, NavArrowUp, Xmark } from "iconoir-react-native";
import { useUniversitySearch } from "@/services/universitySearch";
import CommunityLogo from "../LogoHolder";
import ActionSheet, {
  ActionSheetRef,
  FlatList,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultBottomSheetSnapPoints } from "@/types/constant";

interface SelectDropdownProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  icon: string;
  search?: boolean;
  rules?: object;
  setValue?: (name: string, value: any) => void;
  isMarginBottom?: boolean;
}

const SelectUniversityDropdownBottomSheet: React.FC<SelectDropdownProps> = ({
  control,
  name,
  label,
  placeholder,
  icon,
  search = false,
  rules,
  setValue,
  isMarginBottom = true,
}) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<TextInput>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const { data: universitiesData, isFetching } = useUniversitySearch(
    show,
    searchTerm,
    1,
    10,
  );
  const universities = universitiesData?.result?.universities;

  return (
    <View style={[isMarginBottom && styles.container]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {/* Dropdown Toggle */}
            <TouchableOpacity
              style={[styles.selectButton, error && styles.selectButtonError]}
              //   onPress={() => setShow(!show)}
              onPress={() => {
                actionSheetRef.current?.show(), setShow(true);
              }}
            >
              <Text style={[styles.selectText, !value && styles.placeholder]}>
                {value || placeholder}
              </Text>
              {value ? (
                <Xmark
                  width={20}
                  height={20}
                  onPress={() => onChange("")}
                  color="#9CA3AF"
                />
              ) : icon === "single" ? (
                <NavArrowDown width={20} height={20} color="#9CA3AF" />
              ) : (
                <View style={styles.iconContainer}>
                  <NavArrowUp width={20} height={20} color="#9CA3AF" />
                  <NavArrowDown width={20} height={20} color="#9CA3AF" />
                </View>
              )}
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error.message}</Text>}

            {/* Dropdown Menu */}

            <ActionSheet
              useBottomSafeAreaPadding
              ref={actionSheetRef}
              gestureEnabled={true}
              safeAreaInsets={insets}
              snapPoints={[100]}
              onClose={() => setShow(false)}
            >
              {/* <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShow(false)}
              > */}
              <TouchableOpacity
                style={styles.modalContent}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  {/* <Text style={styles.modalTitle}>Select University</Text> */}
                  {search && (
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search..."
                      onChangeText={setSearchTerm}
                      value={searchTerm}
                      ref={searchRef}
                    />
                  )}
                </View>
                <FlatList
                  data={universities}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        onChange(item.name);
                        setValue && setValue("universityId", item._id);
                        setValue && setValue("communityId", item.communityId);
                        setValue && setValue("universityLogo", item.logo);
                        actionSheetRef.current?.hide();
                      }}
                    >
                      <CommunityLogo logoUrl={item?.logo} variant="small" />
                      <Text style={styles.optionText}>{item?.name}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyList}>
                      {isFetching ? (
                        <ActivityIndicator />
                      ) : (
                        <Text>No University Found</Text>
                      )}
                    </View>
                  }
                />
              </TouchableOpacity>
              {/* </TouchableOpacity> */}
            </ActionSheet>
          </>
        )}
      />
    </View>
  );
};

export default SelectUniversityDropdownBottomSheet;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,

  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  selectButtonError: {
    borderColor: "#EF4444",
  },
  selectText: {
    fontSize: 14,
    color: "#1F2937",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 8,
    height:"100%"
  },
  modalHeader: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#1F2937",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  universityLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#3A3B3C",
    fontWeight: "600",
    lineHeight: 20,
  },
  emptyList: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});
