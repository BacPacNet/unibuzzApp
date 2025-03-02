import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import { Controller } from "react-hook-form";
import { NavArrowDown, NavArrowUp, Xmark } from "iconoir-react-native";
import { useUniversitySearch } from "@/services/universitySearch";

interface SelectDropdownProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  icon: string;
  search?: boolean;
  rules?: object;
  setValue?: (name: string, value: any) => void;
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
}) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<TextInput>(null);

  const { data: universities, isFetching } = useUniversitySearch(
    searchTerm || " "
  );

  return (
    <View style={styles.container}>
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
              onPress={() => setShow(!show)}
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
            <Modal
              visible={show}
              transparent
              animationType="slide"
              onRequestClose={() => setShow(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShow(false)}
              >
                <TouchableOpacity
                  style={styles.modalContent}
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select University</Text>
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
                    data={universities?.result}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                          onChange(item.name);
                          setValue && setValue("universityId", item._id);
                          setShow(false);
                        }}
                      >
                        <Image
                          style={styles.universityLogo}
                          source={{ uri: item?.logos?.[0] }}
                        />
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
              </TouchableOpacity>
            </Modal>
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
    maxHeight: "80%",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  universityLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#1F2937",
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
