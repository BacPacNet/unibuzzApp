import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const timeAgo = (timestamp: string) => {
  return dayjs(timestamp).fromNow();
};
