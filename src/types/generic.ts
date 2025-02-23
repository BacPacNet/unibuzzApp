import { User } from "@/models/auth";

type Page = {
  currentPage: number;
  totalPages: number;
  users: User[];
};

export type UsersProfileForConnectionsResponse = {
  pageParams: number[];
  pages: Page[];
};
