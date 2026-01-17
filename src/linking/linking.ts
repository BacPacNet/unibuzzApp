import type { LinkingOptions } from "@react-navigation/native";

export const linking: LinkingOptions<any> = {
  prefixes: [
    "unibuzz://",
    "https://unibuzz.org",
    "https://www.unibuzz.org",
    "https://dev-unibuzz.vercel.app",
    "https://saiyangym.netlify.app",
  ],
  config: {
    screens: {
      LoginScreen: "login",
      RegisterScreen: "register",
      ForgetPassword: "forget-password",

      tabsGroup: {
        screens: {
          Home: "",
          Timeline: "timeline",

          ProfileStack: {
            screens: {
              Profile: {
                path: "profile/:userId",
                parse: {
                  userId: (userId: string) => userId,
                },
              },
            },
          },

          SinglePost: {
            path: "post/:postID",
            parse: {
              postID: (id: string) => id,
              isType: (type: string) => type,
            },
          },
          Community: {
            path: "community/:communityId",
            parse: {
              communityId: (communityId: string) => communityId,
            },
          },
        },
      },

      NotFound: "*",
    },
  },
};
