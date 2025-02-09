import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import ReusableButton from "@/components/atoms/ReusableButton";
import {
  Mail,
  Phone,
  PrintingPage,
  Link,
  City,
  Clock,
} from "iconoir-react-native";

const University = ({ route }: any) => {
  //   const { pathUrl } = route.params;
  const { data } = route.params;
  const [imageSrc, setImageSrc] = useState(
    data?.images[0] ||
      "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
  );
  const [logoSrc, setLogoSrc] = useState(
    data?.logos?.[0] ||
      "https://cdn.pixabay.com/photo/2021/11/09/00/15/building-6780404_1280.png",
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <View className="p-4">
        <Image
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: 300, borderRadius: 10 }}
          onError={() =>
            setImageSrc(
              "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
            )
          }
        />
        <View className="w-full py-4  rounded-b-2xl relative flex flex-row items-center gap-2">
          <Image
            source={{ uri: logoSrc }}
            className="w-20 h-20  p-1 rounded-full"
            onError={() =>
              setLogoSrc(
                "https://cdn.pixabay.com/photo/2021/11/09/00/15/building-6780404_1280.png",
              )
            }
          />
          <Text className=" flex flex-row items-center text-sm font-bold max-w-72">
            {data?.name}
          </Text>
        </View>
        <Text className=" flex flex-row items-center text-sm font-bold  ">
          {data?.topUniInfo?.about || "Not Available"}
        </Text>

        {data?.isCommunityCreated ? (
          <ReusableButton
            containerStyle="mt-4"
            buttonText="Join Community"
            variant="primary"
          />
        ) : (
          <ReusableButton
            containerStyle="mt-4"
            buttonText="Endorse"
            variant="primary"
          />
        )}

        {UniversityOverview()}
        {UniversityContact(data)}
        {UniversityReviews()}
      </View>
    </ScrollView>
  );
};

const UniversityOverview = () => {
  return (
    <View className="flex flex-col gap-4 ">
      <Text className="text-neutral-900 text-base font-extrabold">
        Overview
      </Text>

      <View className="flex flex-col gap-4">
        <Text className="text-neutral-500 text-xs">
          Loremium University boasts a world-class faculty, many of whom are
          leaders in their respective fields. The university's commitment to
          innovation and research has led to groundbreaking discoveries and
          advancements, particularly in the realms of biotechnology,
          environmental science, and digital arts. The state-of-the-art
          laboratories and creative studios provide students with the resources
          and inspiration needed to push the boundaries of knowledge and
          creativity.
        </Text>

        <Text className="text-neutral-500 text-xs">
          In addition to its scientific prowess, Loremium University is a
          thriving cultural hub. The university's School of Arts is renowned for
          its avant-garde approach to art and design, producing graduates who
          have gone on to achieve international acclaim. Regular exhibitions,
          performances, and lectures by visiting artists and scholars enrich the
          campus life and foster a dynamic exchange of ideas.
        </Text>

        <Text className="text-neutral-500 text-xs">
          Loremium University is a magnet for students from around the globe,
          drawn by its stellar reputation and welcoming atmosphere. The
          university's diverse student body, hailing from over 80 countries,
          creates a rich tapestry of cultures and perspectives. Dedicated
          support services ensure that international students feel at home,
          making their transition to life in Loremium seamless and enjoyable.
        </Text>
      </View>
    </View>
  );
};

const UniversityCard = ({
  icon,
  title,
  info,
}: {
  icon: any;
  title: string;
  info: string;
}) => {
  const Icon = icon;
  return (
    <View className="flex flex-row items-center gap-2">
      {/* <Text className="text-2xl">{icon}</Text> */}
      <Icon height={20} width={20} />
      <View style={{ height: 24 }} className="flex flex-col">
        <Text className="text-neutral-500 text-xs">{title}</Text>
        <Text className="text-neutral-900 text-sm">
          {info || "Not available"}
        </Text>
      </View>
    </View>
  );
};

const UniversityContact = (data: any) => {
  const contactData = [
    {
      icon: Mail,
      title: "Email",
      info: data?.wikiInfoBox?.email,
    },
    {
      icon: Phone,
      title: "Phone",
      info: data?.collegeBoardInfo?.["Phone number"],
    },
    {
      icon: PrintingPage,
      title: "Fax",
      info: data?.wikiInfoBox?.fax,
    },
  ];

  const additionalData = [
    {
      icon: Link,
      title: "Link",
      info: data?.collegeBoardInfo?.website,
    },
    {
      icon: City,
      title: "Address",
      info: data?.collegeBoardInfo?.Location,
    },
    {
      icon: Clock,
      title: "Office Hours",
      info:
        data?.wikiInfoBox?.["Office Hours"] ||
        "Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m",
    },
  ];

  return (
    <View className="flex flex-col gap-4 mt-4">
      <Text className="text-neutral-900 text-base font-extrabold">
        Contact Info
      </Text>

      <View className="flex  justify-between gap-5 flex-col">
        <View className="bg-neutral-200 py-2 px-4 w-full h-52 rounded-lg flex flex-col gap-10  ">
          {contactData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info}
            />
          ))}
        </View>

        <View className="bg-neutral-200 py-2 px-4 w-full h-52 rounded-lg flex flex-col gap-10  ">
          {additionalData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const UniversityReviews = () => {
  return (
    <View className="flex flex-col gap-4 mt-4">
      <Text className="text-neutral-900 text-base font-extrabold">Reviews</Text>

      <View className="flex flex-col gap-4 items-center justify-center h-60">
        <Text className="text-neutral-900 text-base font-extrabold">
          Reviews are coming soon!
        </Text>

        <Text className="text-neutral-700 text-xs text-center max-w-lg">
          This feature is under construction. If you would like to have it
          sooner send us some feedback!
        </Text>
      </View>
    </View>
  );
};

export default University;
