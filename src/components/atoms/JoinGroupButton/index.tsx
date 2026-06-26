import React from "react";
import ReusableButton from "@/components/atoms/ReusableButton";
import { status } from "@/types/CommunityGroup";

interface Props {
  isPrivate: boolean;
  isUniversityWide?: boolean;
  isApplicant?: boolean;
  isVerified: boolean;
  isPending: boolean;
  userStatus: status;
  onClick: () => void;
  isRequestRequiredToJoinGroup: boolean;
}

const JoinGroupButton: React.FC<Props> = ({
  isPrivate,
  isUniversityWide,
  isApplicant,
  isVerified,
  isPending,
  userStatus,
  onClick,
  isRequestRequiredToJoinGroup,
}) => {
  if (isUniversityWide && isApplicant) {
    return (
      <ReusableButton
        buttonText="University Members Only"
        variant="primary"
        containerStyle="opacity-60 "
        disabled
        size={"fit"}
      />
    );
  }

  if (isRequestRequiredToJoinGroup) {
    if (isUniversityWide && !isVerified) {
      return (
        <ReusableButton
          buttonText="University Members Only"
          variant="primary"
          containerStyle="opacity-60 "
          disabled
          size={"fit"}
        />
      );
    }

    return (
      <ReusableButton
        onPress={onClick}
        buttonText={
          userStatus === status.pending ? "Request Pending" : "Request Access"
        }
        disabled={userStatus === status.pending}
        variant="primary"
        size={"fit"}
        height="small"
        textSize="text-2xs"
        containerStyle=""
      />
    );
  }

  return (
    <ReusableButton
      onPress={onClick}
      buttonText="Join Group"
      isLoading={isPending}
      disabled={isPending}
      variant="primary"
      //   size={95}
      size={"fit"}
      height="small"
      textSize="text-2xs"
      containerStyle=""
    />
  );
};

export default JoinGroupButton;
