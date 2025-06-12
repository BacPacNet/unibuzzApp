import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  GraduationCap,
  Book,
  Mail,
  Phone,
  BirthdayCake,
  MapPin,
} from "iconoir-react-native";
import dayjs from "dayjs";
import { convertToDateObj } from "@/utils";
import { format } from "date-fns";

type ProfileInfoProps = {
  email?: string;
  phone?: string;
  location?: string;
  birthday?: string;
  country?: string;
};

type InfoItemProps = {
  icon: JSX.Element;
  text: string;
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  email,
  phone,
  location,
  birthday,
  country,
}) => {
  const dobFormat = birthday?.includes("/")
    ? convertToDateObj(birthday)
    : Number(birthday);
  const dateOfBirth =
    dobFormat && !isNaN(Number(dobFormat))
      ? format(new Date(dobFormat), "dd MMM yyyy")
      : format(new Date(birthday as string), "dd MMM yyyy");

  return (
    <View style={styles.container}>
      <InfoItem
        icon={<Mail height={24} width={24} color={"grey"} />}
        text={email || "--"}
      />

      <InfoItem
        icon={<Phone height={24} width={24} color={"grey"} />}
        text={phone || "--"}
      />

      <InfoItem
        icon={<MapPin height={24} width={24} color={"grey"} />}
        text={`${location ? location + ", " : ""}${country}` || "--"}
      />

      <InfoItem
        icon={<BirthdayCake height={24} width={24} color={"grey"} />}
        text={dateOfBirth || "--"}
      />
    </View>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => (
  <View style={styles.infoItem}>
    {icon}
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});

export default ProfileInfo;
