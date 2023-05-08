import {
  mdiMonitor,
  mdiAdjust,
  mdiAirplane,
  mdiAccountMultiple
} from "@mdi/js";

export default [
  {
    to: "/",
    icon: mdiAdjust,
    label: "Dashboard",
  },
  {
    to: "/nodes",
    icon: mdiMonitor,
    label: "Nodes",
    isAdmin: true,
  },
  {
    to: "/plans",
    icon: mdiAirplane,
    label: "Plans",
    isAdmin: true,
  },
  {
    to: "/users",
    icon: mdiAccountMultiple,
    label: "Users",
    isAdmin: true,
  },
  // {
  //   to: "/tables",
  //   label: "Tables",
  //   icon: mdiTable,
  // },
  // {
  //   to: "/forms",
  //   label: "Forms",
  //   icon: mdiSquareEditOutline,
  // },
  // {
  //   to: "/ui",
  //   label: "UI",
  //   icon: mdiTelevisionGuide,
  // },
  // {
  //   to: "/responsive",
  //   label: "Responsive",
  //   icon: mdiResponsive,
  // },
  // {
  //   to: "/",
  //   label: "Styles",
  //   icon: mdiPalette,
  // },
  // {
  //   to: "/profile",
  //   label: "Profile",
  //   icon: mdiAccountCircle,
  // },
  // {
  //   to: "/login",
  //   label: "Login",
  //   icon: mdiLock,
  // },
  // {
  //   to: "/error",
  //   label: "Error",
  //   icon: mdiAlertCircle,
  // },
  // {
  //   label: "Dropdown",
  //   icon: mdiViewList,
  //   menu: [
  //     {
  //       label: "Item One",
  //     },
  //     {
  //       label: "Item Two",
  //     },
  //   ],
  // },
  // {
  //   href: "https://github.com/justboil/admin-one-vue-tailwind",
  //   label: "GitHub",
  //   icon: mdiGithub,
  //   target: "_blank",
  // },
  // {
  //   href: "https://github.com/justboil/admin-one-react-tailwind",
  //   label: "React version",
  //   icon: mdiReact,
  //   target: "_blank",
  // },
];
