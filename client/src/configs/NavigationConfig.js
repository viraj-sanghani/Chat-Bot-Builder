import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  AntDesignOutlined,
  SafetyOutlined,
  StopOutlined,
  DotChartOutlined,
  MailOutlined,
  MessageOutlined,
  CalendarOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  LayoutOutlined,
  DesktopOutlined,
  FileDoneOutlined,
  CommentOutlined,
  RobotOutlined,
  PlusCircleOutlined,
  FundOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  FileUnknownOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";

const icon = {
  dashboard: () => (
    <span role="img" className="anticon">
      <SpeedOutlinedIcon />
    </span>
  ),
  profile: () => (
    <span role="img" className="anticon">
      <PersonOutlineOutlinedIcon />
    </span>
  ),
  agents: () => (
    <span role="img" className="anticon">
      <SupportAgentOutlinedIcon />
    </span>
  ),
  users: () => (
    <span role="img" className="anticon">
      <PeopleAltOutlinedIcon />
    </span>
  ),
  bots: () => (
    <span role="img" className="anticon">
      <SmartToyOutlinedIcon />
    </span>
  ),
  report: () => (
    <span role="img" className="anticon">
      <AssessmentOutlinedIcon />
    </span>
  ),
  setting: () => (
    <span role="img" className="anticon">
      <SettingsOutlinedIcon />
    </span>
  ),
};

const dashBoardNavTree = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: icon.dashboard,
    breadcrumb: false,
    submenu: [
      {
        key: "dashboards-default",
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        title: "sidenav.dashboard.default",
        icon: icon.dashboard,
        breadcrumb: false,
        submenu: [],
      },
      /*  {
        key: "dashboards-analytic",
        path: `${APP_PREFIX_PATH}/dashboards/analytic`,
        title: "sidenav.dashboard.analytic",
        icon: DotChartOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "dashboards-sales",
        path: `${APP_PREFIX_PATH}/dashboards/sales`,
        title: "sidenav.dashboard.sales",
        icon: FundOutlined,
        breadcrumb: false,
        submenu: [],
      }, */
    ],
  },
];

const appsNavTree = [
  {
    key: "apps",
    path: `${APP_PREFIX_PATH}/apps`,
    title: "sidenav.apps",
    icon: AppstoreOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: "apps-chat",
        path: `${APP_PREFIX_PATH}/apps/chat`,
        title: "sidenav.apps.chat",
        icon: MessageOutlined,
        breadcrumb: true,
        submenu: [],
      },
    ],
  },
];

const extraNavTree = [
  {
    key: "pages",
    path: `${APP_PREFIX_PATH}/pages`,
    title: "sidenav.pages",
    icon: PlusCircleOutlined,
    breadcrumb: true,
    submenu: [
      {
        key: "extra-pages-agents",
        path: `${APP_PREFIX_PATH}/pages/agents`,
        title: "sidenav.pages.agents",
        icon: icon.agents,
        breadcrumb: true,
        submenu: [],
      },
      /* {
        key: "extra-pages-users",
        path: `${APP_PREFIX_PATH}/pages/users`,
        title: "sidenav.pages.users",
        icon: icon.users,
        breadcrumb: true,
        submenu: [],
      }, */
      {
        key: "extra-pages-bots",
        path: `${APP_PREFIX_PATH}/pages/bots`,
        title: "sidenav.pages.bots",
        icon: icon.bots,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "extra-pages-report",
        path: `${APP_PREFIX_PATH}/pages/report`,
        title: "sidenav.pages.report",
        icon: icon.report,
        breadcrumb: true,
        submenu: [],
      },
      /* {
        key: "extra-pages-invoice",
        path: `${APP_PREFIX_PATH}/pages/invoice`,
        title: "sidenav.pages.invoice",
        icon: "",
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "extra-pages-pricing",
        path: `${APP_PREFIX_PATH}/pages/pricing`,
        title: "sidenav.pages.pricing",
        icon: "",
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "extra-pages-faq",
        path: `${APP_PREFIX_PATH}/pages/faq`,
        title: "sidenav.pages.faq",
        icon: "",
        breadcrumb: false,
        submenu: [],
      }, */
      {
        key: "extra-pages-profile",
        path: `${APP_PREFIX_PATH}/pages/profile`,
        title: "sidenav.pages.profile",
        icon: icon.profile,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "extra-pages-setting",
        path: `${APP_PREFIX_PATH}/pages/setting`,
        title: "sidenav.pages.setting",
        icon: icon.setting,
        breadcrumb: true,
        submenu: [],
      },
    ],
  },
];

const navigationConfig = [...dashBoardNavTree, ...appsNavTree, ...extraNavTree];

export default navigationConfig;
