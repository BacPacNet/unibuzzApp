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
          variant="secondary"
          containerStyle="opacity-60 mt-2"
          disabled
          size="w-1/2"
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
        size="w-1/2"
        containerStyle="mt-2"
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
      size="w-1/2"
      containerStyle="mt-2"
    />
  );
};

export default JoinGroupButton;
