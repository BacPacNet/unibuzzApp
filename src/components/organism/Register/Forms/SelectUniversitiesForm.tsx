import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useGetPartnerUniversities } from "@/services/universitySearch";
import { UniversityInfo } from "@/types/university";
import { RootStackParamList } from "@/types/navigation";
import { Check } from "iconoir-react-native";
import UniversityLogoPlaceholder from "@/assets/LogoCircle.svg";

type Props = {
  onSubmit: (data: any) => Promise<void>;
};

type UniversityListItemProps = {
  university: UniversityInfo;
  isSelected: boolean;
  onToggle: () => void;
};

const UniversityListItem = ({
  university,
  isSelected,
  onToggle,
}: UniversityListItemProps) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showPlaceholder = !university.logo || logoFailed;

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        style={[styles.checkbox, isSelected && styles.checkboxSelected]}
      >
        {isSelected && (
          <Check width={12} height={12} color="#FFFFFF" strokeWidth={3} />
        )}
      </View>
      <View style={styles.logoContainer}>
        {showPlaceholder ? (
          <UniversityLogoPlaceholder width={36} height={36} />
        ) : (
          <Image
            source={{ uri: university.logo! }}
            style={styles.logoImage}
            resizeMode="contain"
            onError={() => setLogoFailed(true)}
          />
        )}
      </View>
      <Text style={styles.universityName}>{university.name}</Text>
    </TouchableOpacity>
  );
};

type LoginNavProp = StackNavigationProp<RootStackParamList, "LoginScreen">;

const SelectUniversitiesForm = ({ onSubmit }: Props) => {
  const { data: universities, isLoading } = useGetPartnerUniversities();
  const { setValue, watch, getValues, handleSubmit, setError } =
    useFormContext();
  const navigation = useNavigation<LoginNavProp>();
  const selectedUniversityIds: string[] = watch("selectedUniversityIds") || [];

  const syncPrimaryUniversity = (ids: string[]) => {
    if (!ids.length) {
      setValue("universityId", "");
      setValue("universityName", "");
      setValue("universityLogo", "");
      setValue("universityDomain", []);
      return;
    }
    const primary = universities?.find((u) => u._id === ids[0]);
    if (primary) {
      setValue("universityId", primary._id);
      setValue("universityName", primary.name);
      setValue("universityLogo", primary.logo || "");
      setValue("universityDomain", primary.domains || []);
      if (primary.communityId) {
        setValue("communityId", primary.communityId);
      }
    }
  };

  const toggleUniversity = (universityId: string) => {
    const current: string[] = getValues("selectedUniversityIds") || [];
    const updated = current.includes(universityId)
      ? current.filter((id) => id !== universityId)
      : [...current, universityId];
    setValue("selectedUniversityIds", updated, { shouldValidate: true });
    syncPrimaryUniversity(updated);
  };

  const selectedCount = selectedUniversityIds.length;

  useEffect(() => {
    const ids = getValues("selectedUniversityIds") || [];
    if (ids.length && universities?.length) {
      syncPrimaryUniversity(ids);
    }
  }, [universities]);

  const handleContinue = () => {
    if (!selectedCount) {
      setError("selectedUniversityIds", {
        message: "Please select at least one university.",
      });
      return;
    }
    handleSubmit(onSubmit)();
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Title>Select Universities</Title>
        <SupportingText className="mt-2">
          Select all universities you would like to join and explore as an
          applicant.
        </SupportingText>
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6744FF" />
          </View>
        ) : universities?.length ? (
          <ScrollView
            showsVerticalScrollIndicator
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {universities.map((university) => (
              <UniversityListItem
                key={university._id}
                university={university}
                isSelected={selectedUniversityIds.includes(university._id)}
                onToggle={() => toggleUniversity(university._id)}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>
            No partner universities available.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <ReusableButton
          onPress={handleContinue}
          disabled={selectedCount === 0}
          buttonText={`Add ${selectedCount} ${
            selectedCount === 1 ? "University" : "Universities"
          }`}
          variant="primary"
          height="large"
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectUniversitiesForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    gap: 32,
  },
  header: {
    width: "100%",
  },
  listContainer: {
    width: "100%",
    maxHeight: 280,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 32,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#6744FF",
    borderColor: "#6744FF",
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  universityName: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
  },
  footer: {
    width: "100%",
    gap: 16,
  },
  loginLink: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#6744FF",
    textAlign: "center",
  },
});
