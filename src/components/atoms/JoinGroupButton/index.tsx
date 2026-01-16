import React from "react";
import ReusableButton from "@/components/atoms/ReusableButton";
import { status } from "@/types/CommunityGroup";

interface Props {
  isPrivate: boolean;
  isVerified: boolean;
  isPending: boolean;
  userStatus: status;
  onClick: () => void;
}

const JoinGroupButton: React.FC<Props> = ({
  isPrivate,
  isVerified,
  isPending,
  userStatus,
  onClick,
}) => {
  //  private
  if (isPrivate) {
    if (!isVerified) {
      return (
        <ReusableButton
          buttonText="Verified Users Only"
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
        // isLoading={userStatus === status.pending}
        variant="primary"
        // size={130}
        size={"fit"}
        height="small"
        textSize="text-2xs"
        containerStyle=""
      />
    );
  }

  //  public
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
