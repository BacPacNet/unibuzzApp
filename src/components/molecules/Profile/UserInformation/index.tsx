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

type ProfileInfoProps = {
  affiliation?: string;
  occupation?: string;
  degree?: string;
  major?: string;
  year?: string;
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
  affiliation,
  occupation,
  degree,
  major,
  year,
  email,
  phone,
  location,
  birthday,
  country,
}) => {
  return (
    <View style={styles.container}>
      {affiliation && occupation ? (
        <>
          {occupation && (
            <InfoItem
              icon={<GraduationCap height={24} width={24} color={"grey"} />}
              text={occupation}
            />
          )}
          {affiliation && (
            <InfoItem
              icon={<Book height={24} width={24} color={"grey"} />}
              text={affiliation}
            />
          )}
        </>
      ) : (
        <>
          {degree && (
            <InfoItem
              icon={<GraduationCap height={24} width={24} color={"grey"} />}
              text={year + " Year, " + degree}
            />
          )}
          {major && (
            <InfoItem
              icon={<Book height={24} width={24} color={"grey"} />}
              text={major}
            />
          )}
        </>
      )}
      {email && (
        <InfoItem
          icon={<Mail height={24} width={24} color={"grey"} />}
          text={email}
        />
      )}
      {phone && (
        <InfoItem
          icon={<Phone height={24} width={24} color={"grey"} />}
          text={phone}
        />
      )}
      {(location || country) && (
        <InfoItem
          icon={<MapPin height={24} width={24} color={"grey"} />}
          text={`${location ? location + ", " : ""}${country}`}
        />
      )}

      {birthday?.length && (
        <InfoItem
          icon={<BirthdayCake height={24} width={24} color={"grey"} />}
          text={dayjs(birthday || new Date()).format("DD MMM YYYY")}
        />
      )}
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
    fontSize: 14,
    color: "#6B7280",
  },
});

export default ProfileInfo;
