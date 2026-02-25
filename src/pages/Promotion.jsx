import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "../components/layout/Mobile";
// import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { UserContext } from "../context/UserState";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingLogo from "../components/utils/LodingLogo";
// import axios from "axios";
import { domain } from "../utils/Secret"
import BottomNavigationArea from "../components/common/BottomNavigation";

const options = [
  // {
  //   label: "Partner rewards",
  //   image: "/assets/icons/promotionIcons/partner.webp",
  // },
  {
    label: "Copy invitation code",
    image: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" fill="none">
      <path
        opacity="0.4"
        d="M40.475 5H19.525C10.425 5 5 10.425 5 19.525V40.45C5 49.575 10.425 55 19.525 55H40.45C49.55 55 54.975 49.575 54.975 40.475V19.525C55 10.425 49.575 5 40.475 5Z"
        fill="#24ee89"
      />
      <path
        d="M53.25 30.5751H44.55C42.1 30.5751 39.925 31.9251 38.825 34.1251L36.725 38.2751C36.225 39.2751 35.225 39.9001 34.125 39.9001H25.925C25.15 39.9001 24.05 39.7251 23.325 38.2751L21.225 34.1501C20.6935 33.0859 19.8767 32.1904 18.8657 31.5636C17.8548 30.9367 16.6895 30.6031 15.5 30.6001H6.75C5.775 30.6001 5 31.3751 5 32.3501V40.5001C5 49.5751 10.45 55.0001 19.55 55.0001H40.5C49.075 55.0001 54.35 50.3001 55 41.9501V32.3251C55 31.3751 54.225 30.5751 53.25 30.5751ZM33.875 19.4951H26.125C25.15 19.4951 24.375 18.7201 24.375 17.7451C24.375 16.7701 25.15 15.9951 26.125 15.9951H33.875C34.85 15.9951 35.625 16.7701 35.625 17.7451C35.625 18.7201 34.825 19.4951 33.875 19.4951ZM35.8225 26.4776H24.1725C23.1975 26.4776 22.4225 25.7026 22.4225 24.7276C22.4225 23.7526 23.1975 22.9776 24.1725 22.9776H35.7975C36.7725 22.9776 37.5475 23.7526 37.5475 24.7276C37.5475 25.7026 36.7725 26.4776 35.8225 26.4776Z"
        fill="#24ee89"
      />
    </svg>),
  },
  {
    label: "Subordinate data",
    image: (<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      width="60"
      fill="none"
    >
      <path
        opacity="0.4"
        d="M54.9744 15.0504C55.0244 15.6504 54.9744 16.2754 54.8244 16.9004L46.3994 50.7254C46.1074 51.9488 45.4098 53.0373 44.4201 53.8136C43.4305 54.5899 42.2071 55.0082 40.9494 55.0004H8.09939C4.32439 55.0004 1.64939 51.3004 2.74939 47.6754L13.2744 13.8504C13.9994 11.5004 16.1744 9.90039 18.6244 9.90039H49.3744C51.7744 9.90039 53.7244 11.3254 54.5494 13.3254C54.7929 13.8704 54.9368 14.4546 54.9744 15.0504Z"
        fill="#24ee89"
      />
      <path
        d="M57.475 49.0503C57.5337 49.8108 57.4342 50.5752 57.183 51.2954C56.9317 52.0156 56.5341 52.6759 56.0151 53.2348C55.496 53.7938 54.8669 54.2392 54.1673 54.543C53.4677 54.8469 52.7127 55.0026 51.95 55.0003H40.95C43.55 55.0003 45.8 53.2503 46.4 50.7253L54.825 16.9003C54.975 16.2753 55.025 15.6503 54.975 15.0503L55 15.0003L57.475 49.0503ZM24.2 17.8278C24.05 17.8278 23.9 17.8028 23.75 17.7778C23.51 17.7193 23.284 17.6139 23.0849 17.4677C22.8857 17.3216 22.7174 17.1375 22.5897 16.9261C22.4619 16.7147 22.3772 16.4801 22.3403 16.2359C22.3035 15.9916 22.3153 15.7425 22.375 15.5028L24.975 4.70282C25.225 3.70282 26.225 3.10282 27.25 3.32782C28.25 3.57782 28.875 4.57782 28.625 5.60282L26.025 16.4028C25.825 17.2528 25.05 17.8278 24.2 17.8278ZM40.95 17.8553C40.825 17.8553 40.675 17.8553 40.55 17.8053C40.0672 17.6944 39.6463 17.4006 39.3758 16.9855C39.1054 16.5705 39.0065 16.0668 39.1 15.5803L41.45 4.73032C41.675 3.70532 42.675 3.08032 43.675 3.28032C44.675 3.50532 45.325 4.50532 45.125 5.50532L42.775 16.3553C42.6 17.2553 41.825 17.8553 40.95 17.8553ZM39.25 31.8753H19.25C18.225 31.8753 17.375 31.0253 17.375 30.0003C17.375 28.9753 18.225 28.1253 19.25 28.1253H39.25C40.275 28.1253 41.125 28.9753 41.125 30.0003C41.125 31.0253 40.275 31.8753 39.25 31.8753ZM36.75 41.8753H16.75C15.725 41.8753 14.875 41.0253 14.875 40.0003C14.875 38.9753 15.725 38.1253 16.75 38.1253H36.75C37.775 38.1253 38.625 38.9753 38.625 40.0003C38.625 41.0253 37.775 41.8753 36.75 41.8753Z"
        fill="#24ee89"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1855 30.0003C17.1855 28.8168 18.1449 27.8574 19.3284 27.8574H39.0427C40.2261 27.8574 41.1855 28.8168 41.1855 30.0003C41.1855 31.1837 40.2261 32.1431 39.0427 32.1431H19.3284C18.1449 32.1431 17.1855 31.1837 17.1855 30.0003Z"
        fill="#24ee89"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5713 39.8567C14.5713 38.6733 15.5306 37.7139 16.7141 37.7139H36.4284C37.6119 37.7139 38.5713 38.6733 38.5713 39.8567C38.5713 41.0402 37.6119 41.9996 36.4284 41.9996H16.7141C15.5306 41.9996 14.5713 41.0402 14.5713 39.8567Z"
        fill="#24ee89"
      />
    </svg>),
  },
  {
    label: "Commission detail",
    image: (<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.4"
        d="M40.475 5H19.525C10.425 5 5 10.425 5 19.525V40.45C5 49.575 10.425 55 19.525 55H40.45C49.55 55 54.975 49.575 54.975 40.475V19.525C55 10.425 49.575 5 40.475 5Z"
        fill="#24ee89"
      />
      <path
        d="M35.6504 30L31.8754 28.675V20.2H32.7754C34.8004 20.2 36.4504 21.975 36.4504 24.15C36.4504 25.175 37.3004 26.025 38.3254 26.025C39.3504 26.025 40.2004 25.175 40.2004 24.15C40.2004 19.9 36.8754 16.45 32.7754 16.45H31.8754V15C31.8754 13.975 31.0254 13.125 30.0004 13.125C28.9754 13.125 28.1254 13.975 28.1254 15V16.45H26.5004C22.8004 16.45 19.7754 19.575 19.7754 23.4C19.7754 27.875 22.3754 29.3 24.3504 30L28.1254 31.325V39.775H27.2254C25.2004 39.775 23.5504 38 23.5504 35.825C23.5504 34.8 22.7004 33.95 21.6754 33.95C20.6504 33.95 19.8004 34.8 19.8004 35.825C19.8004 40.075 23.1254 43.525 27.2254 43.525H28.1254V45C28.1254 46.025 28.9754 46.875 30.0004 46.875C31.0254 46.875 31.8754 46.025 31.8754 45V43.55H33.5004C37.2004 43.55 40.2254 40.425 40.2254 36.6C40.2004 32.1 37.6004 30.675 35.6504 30ZM25.6004 26.475C24.3254 26.025 23.5504 25.6 23.5504 23.425C23.5504 21.65 24.8754 20.225 26.5254 20.225H28.1504V27.375L25.6004 26.475ZM33.5004 39.8H31.8754V32.65L34.4004 33.525C35.6754 33.975 36.4504 34.4 36.4504 36.575C36.4504 38.35 35.1254 39.8 33.5004 39.8Z"
        fill="#24ee89"
      />
    </svg>),
  },
  {
    label: "Invitation rules",
    image: (<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      fill="none"
    >
      <path
        opacity="0.4"
        d="M52.5 17.5V42.5C52.5 50 48.75 55 40 55H20C11.25 55 7.5 50 7.5 42.5V17.5C7.5 10 11.25 5 20 5H40C48.75 5 52.5 10 52.5 17.5Z"
        fill="#24ee89"
      />
      <path
        d="M38.75 5V24.65C38.75 25.75 37.45 26.3 36.65 25.575L30.85 20.225C30.62 20.0084 30.3159 19.8878 30 19.8878C29.6841 19.8878 29.38 20.0084 29.15 20.225L23.35 25.575C23.1711 25.7409 22.9476 25.8508 22.7071 25.8912C22.4665 25.9317 22.2193 25.9008 21.9961 25.8025C21.7728 25.7041 21.5832 25.5426 21.4507 25.3378C21.3181 25.133 21.2483 24.8939 21.25 24.65V5H38.75ZM43.75 36.875H33.125C32.1 36.875 31.25 36.025 31.25 35C31.25 33.975 32.1 33.125 33.125 33.125H43.75C44.775 33.125 45.625 33.975 45.625 35C45.625 36.025 44.775 36.875 43.75 36.875ZM43.75 46.875H22.5C21.475 46.875 20.625 46.025 20.625 45C20.625 43.975 21.475 43.125 22.5 43.125H43.75C44.775 43.125 45.625 43.975 45.625 45C45.625 46.025 44.775 46.875 43.75 46.875Z"
        fill="#24ee89"
      />
    </svg>),
  },
  // {
  //   label: "New Subordinates",
  //   image: "/assets/icons/promotionIcons/partner.webp",
  // },
  {
    label: "Agent line customer service",
    image: (<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      fill="none"
    >
      <path
        opacity="0.4"
        d="M13.4999 50C9.89986 44.4 10.3332 36.6667 10.9999 33.5L21.9999 21L33.9999 29.5L49.4999 33.5C49.9999 36 50.3999 42.4 47.9999 48C44.9999 55 35.9999 59 30.4999 59C24.9999 59 17.9999 57 13.4999 50Z"
        fill="#24ee89"
      />
      <path
        d="M54.7158 33.4087V31.6947C54.8437 23.8926 52.5542 17.3183 48.0392 12.6498C45.8491 10.3941 43.1899 8.64749 40.2498 7.53358C39.7766 3.37668 35.2488 0 29.7361 0C24.2234 0 19.67 3.32552 19.2223 7.54637C16.2861 8.66044 13.6311 10.4072 11.4457 12.6625C6.96908 17.3183 4.61563 23.8542 4.75633 31.6692V33.754C4.03645 34.4538 3.52496 35.3397 3.27881 36.313C3.03266 37.2863 3.06152 38.3088 3.36217 39.2667C3.60387 40.1445 4.05307 40.9513 4.6719 41.6191C5.29073 42.2869 6.06105 42.7961 6.91791 43.1038C7.79515 43.6676 8.81692 43.9653 9.85972 43.9608C10.8147 48.5559 13.354 52.6694 17.0339 55.5824C20.7138 58.4955 25.3002 60.0229 29.9919 59.8977C34.6792 60.0168 39.2596 58.4866 42.9342 55.5741C46.6087 52.6615 49.1442 48.5515 50.0985 43.9608H50.3031C51.5987 43.9477 52.8518 43.497 53.8589 42.6817C54.5138 42.3061 55.0874 41.8039 55.5463 41.2044C56.0053 40.605 56.3403 39.9202 56.5321 39.1899C56.8329 38.1467 56.8212 37.0381 56.4984 36.0014C56.1756 34.9647 55.5558 34.0455 54.7158 33.3575V33.4087ZM48.7555 38.5248C48.7579 39.7582 48.6638 40.9898 48.4741 42.2085C46.7906 44.9067 44.5039 47.1774 41.7939 48.842C39.084 50.5065 36.0248 51.5196 32.8569 51.8013C32.5162 51.4174 32.0929 51.1155 31.6189 50.9184C31.1448 50.7212 30.6324 50.6339 30.1198 50.663C28.4059 50.663 27.0245 51.5967 27.0245 52.7606C27.0245 53.9245 28.3931 54.8582 30.1198 54.8582C30.7471 54.9242 31.3792 54.7903 31.9259 54.4756C32.4726 54.1609 32.9059 53.6815 33.1639 53.1059C35.3153 52.864 37.4237 52.3304 39.4312 51.5199C42.2032 50.4095 44.7125 48.7323 46.7985 46.5956C47.1439 46.2503 47.4509 45.9049 47.7578 45.534C45.2893 53.1059 38.6766 57.9663 30.0814 57.9663H29.9919C18.9154 57.9663 11.2155 49.9851 11.2155 38.576V37.4888C11.2155 37.0028 11.2922 35.6981 11.3562 34.4703C15.948 32.7947 20.0921 26.3867 21.7676 23.4321C24.4363 27.0903 28.0667 29.9371 32.2558 31.6564C34.2362 32.3468 36.2675 32.8813 38.3313 33.2552C42.3475 34.1121 46.1462 34.9307 48.7171 38.2946L48.8194 38.3841L48.7555 38.5248Z"
        fill="#24ee89"
      />
    </svg>),
  },
  {
    label: "Rebate ratio",
    image: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
      <path opacity="0.36" d="M18.75 17.9814C23.9068 20.0007 30.0104 20.0007 30.0104 20.0007C30.0104 20.0007 36.1 20.0007 41.25 17.9814C46.8773 24.5487 50.8205 33.2062 53.4121 40.4976C56.0359 47.8791 50.2508 55.0007 42.4168 55.0007H17.5246C9.71023 55.0007 3.93235 47.9117 6.54287 40.5462C9.12242 33.2679 13.0685 24.6074 18.75 17.9814Z" fill="#24ee89" stroke="#24ee89" stroke-width="2" stroke-linejoin="round" />
      <path d="M30 25V47" stroke="#24ee89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M35.5 27C35.5 27 30.4853 27 28 27C25.5147 27 23.5 29.0147 23.5 31.5C23.5 33.9853 25.5147 36 28 36" stroke="#24ee89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M24.5 45C24.5 45 29.5147 45 32 45C34.4853 45 36.5 42.9853 36.5 40.5C36.5 38.0147 34.4853 36 32 36H28" stroke="#24ee89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M30 20C38.9746 20 46.25 16.6421 46.25 12.5C46.25 8.35786 38.9746 5 30 5C21.0254 5 13.75 8.35786 13.75 12.5C13.75 16.6421 21.0254 20 30 20Z" fill="#24ee89" stroke="#24ee89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    ),
  },
];

const Promotion = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  // const { isAdmin, logout } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(400));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(340));
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();
  const { userData, getUserData } = useContext(UserContext);

  // let inviteCode = "";

  // if (userData?.referralLink) {
  //   try {
  //     const url = new URL(userData.referralLink)
  //     inviteCode = url.searchParams.get("invitecode") || ""
  //   } catch (error) {
  //     console.error("Invalid referralLink:", error)
  //   }
  // }

  // const [inviteLink, setInviteLink] = useState("");
  const [lifetimeCommission, setLifetimeCommission] = useState(0);
  const [totalDirectSubordinates, setTotalDirectSubordinates] = useState(0);
  // const [totalTeamSubordinates, setTotalTeamSubordinates] = useState(0);
  const [totalAllSubordinates, setTotalAllSubordinates] = useState(0);
  // const [copiedCode, setCopiedCode] = useState("");
  // const [commission, setCommission] = useState(0);
  const [thisWeekCommission, setThisWeekCommission] = useState(0);
  const [yesterdayCommission, setYesterdayCommission] = useState(0);
  const [logoLoading, setLogoLoading] = useState(true); // Loading state
  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const fetchLifetimeCommission = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/promotion/commissions?_t=${Date.now()}`,
          {
            withCredentials: true,
          },
        );

        const summary = response.data?.data?.summary || {};

        let lifetimeCommissionData = (
          summary.totalCommissionAmount || 0
        ).toFixed(2);
        let thisWeekCommissionData = (
          summary.thisWeekCommissionAmount || 0
        ).toFixed(2);
        let yesterdayCommissionData = (
          summary.yesterdayCommissionAmount ??
          summary.todayCommissionAmount ??
          0
        ).toFixed(2);

        setYesterdayCommission(parseFloat(yesterdayCommissionData)); // Commission for yesterday's transactions (credited today)
        setThisWeekCommission(parseFloat(thisWeekCommissionData));
        setLifetimeCommission(parseFloat(lifetimeCommissionData));
      } catch (err) {
        console.error("Error fetching lifetime commission data:", err);
        setLifetimeCommission(0);
        setThisWeekCommission(0);
        setYesterdayCommission(0);
      }
    };

    fetchLifetimeCommission();
  }, []);

  const [subordinate, setSubordinates] = useState(0);

  useEffect(() => {
    const fetchSubordinateData = async () => {
      try {
        // timeFilter=yesterday = server's (CURRENT_DATE - 1) = activity date that generated "Yesterday's commission"
        const response = await axiosInstance.get(
          `${domain}/api/subordinate/analysis?timeFilter=yesterday&_t=${Date.now()}`,
          {
            withCredentials: true,
          },
        );
        setSubordinates(response.data.data);
        setTotalDirectSubordinates(
          response.data.data?.filteredDirectSubordinates ?? 0,
        );
        setTotalAllSubordinates(
          (response.data.data?.filteredDirectSubordinates ?? 0) +
          (response.data.data?.filteredIndirectSubordinates ?? 0),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubordinateData();
  }, []);

  const [totalCommission, SetTotalCommission] = useState(0);

  const handleCopyLink = async () => {
    navigate("/promotion/invite-link");
  };

  const dataItems = [
    {
      heading: "number of register",
      value: subordinate?.filteredDirectSubordinates || 0,
    },
    {
      heading: "Deposit number ",
      value: subordinate?.filteredDirectDeposits || 0,
    },
    {
      heading: "Deposit amount ",
      value: subordinate?.filteredDirectDepositAmount || 0,
    },
    {
      heading: "Number of people making first deposit ",
      value: subordinate?.filteredDirectFirstDeposits || 0,
    },
    {
      heading: "number of register",
      value: subordinate?.filteredIndirectSubordinates || 0,
    },
    {
      heading: "Deposit number ",
      value: subordinate?.filteredIndirectDeposits || 0,
    },
    {
      heading: "Deposit amount ",
      value: subordinate?.filteredIndirectDepositAmount || 0,
    },
    {
      heading: "Number of people making first deposit ",
      value: subordinate?.filteredIndirectFirstDeposits || 0,
    },
  ];

  const data = [
    { heading: "This Week", value: thisWeekCommission || 0 },
    { heading: "Total commission", value: lifetimeCommission || 0 },
    { heading: "direct subordinate", value: totalDirectSubordinates || 0 },
    {
      heading: "Total number of subordinates in the team",
      value: totalAllSubordinates || 0,
    },
    {
      heading: "First Deposits Direct",
      value: subordinate?.filteredDirectFirstDeposits ?? 0,
    },
    {
      heading: "First Deposits Team",
      value: subordinate?.filteredIndirectFirstDeposits ?? 0,
    },
  ];

  const [alertMsg, setAlertMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = (message) => {
    setAlertMsg(message);
    setOpenSnackbar(true);

    setTimeout(() => {
      setOpenSnackbar(false);
      setAlertMsg(""); // Clear the message
    }, 3000);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsPopupVisible(false);
    setPopupMessage(""); // Clear the message
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoLoading(false); // Hide loading after 2 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup
  }, []);
  const handleOptionClick = (option) => {
    //console.log("option", option);

    switch (option.label) {
      case "Copy invitation code":
        try {
          //console.log("userData1", userData);
          if (userData && userData.inviteCode) {
            // Fallback method using document.execCommand("copy")
            const tempInput = document.createElement("textarea");
            tempInput.value = userData.inviteCode;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);

            //console.log("Copied successfully using fallback method!");
            handleOpenSnackbar("Invitation code copied successfully");
          } else {
            handleOpenSnackbar("Invitation code not available");
          }
        } catch (err) {
          console.error("Failed to copy invitation code: ", err);
        }
        break;

      case "Subordinate data":
        navigate("/promotion/subordinate-data");
        break;

      // case "Partner rewards":
      //   navigate("/promotion/new-subordinate");
      //   break;

      case "Commission detail":
        navigate("/promotion/commission-detail");
        break;

      case "Invitation rules":
        navigate("/promotion/invitation-rule");
        break;

      case "Agent line customer service":
        navigate("/customer-service");
        break;

      case "Rebate ratio":
        navigate("/activity/betting-rebate");
        break;

      // Add more cases for other options
      default:
      //console.log(`Clicked on option: ${option.label}`);
    }
  };

  return (
    <>
      <Mobile>
        {openSnackbar && alertMsg && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1500,
              // Maxwidth: "300px",
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                textAlign: "center",
                "& .MuiAlert-icon": {
                  color: "orange", // Changes the icon color
                },
              }}
            >
              {alertMsg}
            </Alert>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          {logoLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
              }}
            >
              <LoadingLogo websiteName="100Win" />
            </div>
          )}
          <Box flexGrow={1} sx={{ backgroundColor: "#232626" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "10px 16px",
                color: "#ffffff",
              }}
            >
              {/* Centered Text */}
              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", position: "relative" }}
              >
                <span style={{ fontSize: isSmallScreen2 ? "1rem" : "1.2rem" }}>
                  Agency
                </span>
                {/* Icon on the Right */}
                <img
                  src="/assets/icons/promotionIcons/filter.svg"
                  alt="icon"
                  style={{
                    width: isSmallScreen2 ? "18px" : "22px",
                    position: "absolute",
                    right: "3px", // Matches container padding
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  onClick={() => navigate("/promotion/new-subordinate")}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              mt={0}
              mb={13}
              sx={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100%",
                borderRadius: "10px",
              }}
            >
              {/* First Grid */}

              <Grid
                item
                xs={12}
                sx={{
                  borderRadius: "0px 0px 0 0",
                  backgroundImage:
                    "url(/assets/icons/promotionbg.webp),linear-gradient(90deg,#24ee89,#9fe871)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  height: "250px",
                  // padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&.MuiGrid-item ": {
                    paddingLeft: "0",
                  },
                }}
              >
                {/* Header Content */}
                <Typography
                  variant="h5"
                  mt={1}
                  sx={{
                    color: "black",
                    fontSize: isSmallScreen2
                      ? "20px"
                      : isSmallScreen
                        ? "24px"
                        : "26px",
                  }}
                  align="center"
                >
                  {`${yesterdayCommission.toFixed(2)}`}
                </Typography>

                <Typography
                  variant="body2"
                  color="#24ee89"
                  backgroundColor="#323738"
                  align="center"
                  mt="3px"
                  padding="2.2px 15px"
                  borderRadius="25px"
                  sx={{
                    fontSize: isSmallScreen2
                      ? "0.7rem"
                      : isSmallScreen
                        ? "0.75rem"
                        : "0.875rem",
                  }}
                >
                  Yesterday's Total commission
                </Typography>

                <Typography
                  variant="caption"
                  color={"black"}
                  align="center"
                  mt="3px"
                  sx={{
                    fontSize: isSmallScreen2
                      ? "10px"
                      : isSmallScreen
                        ? "11px"
                        : "11.7px",
                  }}
                >
                  Upgrade the level to increase commission income
                </Typography>

                {/* Inner Grid Container */}
                <Grid
                  container
                  sx={{
                    maxHeight: "70%",
                    width: "calc(100% - 30px)",
                    margin: "5px auto",
                    // marginTop: "5px",
                    borderRadius: "8px",
                    boxShadow: 2,
                  }}
                >
                  {/* Header */}
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{
                      borderRadius: "8px 8px 0 0",
                      backgroundColor: "#00441b",
                      // borderRight: "1px solid #ccc",
                      padding: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // Ensures both sections are spaced properly
                      flexWrap: "nowrap", // Prevents wrapping to the next line
                    }}
                  >
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        // borderRight: "1px solid #ccc",
                        paddingRight: "0.5rem",
                        flexWrap: "nowrap", // Prevents wrapping
                      }}
                    >
                      <img
                        src="/assets/icons/promotionIcons/Direct Subordinate.webp"
                        alt="camera"
                        style={{
                          width: isSmallScreen2
                            ? "18px"
                            : isSmallScreen
                              ? "20px"
                              : "24px",
                          marginRight: "5px",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontSize: isSmallScreen2
                            ? "0.5rem"
                            : isSmallScreen
                              ? "0.5rem"
                              : "0.75rem",
                        }}
                        align="center"
                      >
                        Direct subordinates
                      </Typography>
                    </Grid>
                    <Grid
                      sx={{
                        width: "1px",
                        bgcolor: "#323738",
                        color: "transparent",
                        height: "180%",
                      }}
                    >
                      .
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "0.5rem",
                        flexWrap: "nowrap", // Prevents wrapping
                      }}
                    >
                      <img
                        src="/assets/icons/promotionIcons/Team Subordinate.webp"
                        alt="camera"
                        style={{
                          width: isSmallScreen2
                            ? "18px"
                            : isSmallScreen
                              ? "20px"
                              : "24px",
                          marginRight: "5px",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontSize: isSmallScreen2
                            ? "0.5rem"
                            : isSmallScreen
                              ? "0.5rem"
                              : "0.75rem",
                        }}
                        align="center"
                      >
                        Team subordinates
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Content */}
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      px: "7px",
                      pt: "10px",
                      pb: isSmallScreen2 ? "10px" : "4px",
                      backgroundColor: "#323738",
                      borderRadius: "0 0 8px 8px",
                      position: "relative", // To ensure the divider aligns correctly
                    }}
                  >
                    {/* Vertical divider */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%", // Align center vertically
                        left: "50%", // Align center horizontally
                        transform: "translate(-50%, -50%)", // Adjust positioning to center
                        height: "90%", // Make the line smaller (relative to container height)
                        width: "0.5px", // Thickness of the line
                        backgroundColor: "#40392e",
                      }}
                    />

                    {[0, 1, 2, 3].map((index) => (
                      <React.Fragment key={index}>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            marginBottom: "5px",
                            textAlign: "center", // Center-align text
                            paddingRight: "10px", // Add padding for spacing near the divider
                          }}
                        >
                          <Typography
                            variant="h7"
                            align="center"
                            sx={{
                              fontSize: isSmallScreen2
                                ? "12px"
                                : isSmallScreen
                                  ? "13px"
                                  : "15px",
                              color:
                                index === 1
                                  ? "green"
                                  : index === 2
                                    ? "orange"
                                    : "#ffffff",
                            }}
                          >
                            {dataItems[index].value}
                          </Typography>
                          <Typography
                            variant="caption"
                            align="center"
                            fontSize={
                              isSmallScreen2 ? 9 : isSmallScreen ? 10 : 11
                            }
                            sx={{
                              color: "#ffffff",
                              display: "block",
                              lineHeight: "1.4",
                            }}
                          >
                            {dataItems[index].heading}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          sx={{
                            marginBottom: "5px",
                            textAlign: "center", // Center-align text
                            paddingLeft: "10px", // Add padding for spacing near the divider
                          }}
                        >
                          <Typography
                            variant="h7"
                            align="center"
                            sx={{
                              fontSize: isSmallScreen2
                                ? "12px"
                                : isSmallScreen
                                  ? "13px"
                                  : "15px",
                              color:
                                index === 1
                                  ? "green"
                                  : index === 2
                                    ? "orange"
                                    : "#ffffff",
                            }}
                          >
                            {dataItems[index + 4].value}
                          </Typography>
                          <Typography
                            variant="caption"
                            align="center"
                            fontSize={
                              isSmallScreen2 ? 9 : isSmallScreen ? 10 : 11
                            }
                            sx={{
                              color: "#ffffff",
                              display: "block",
                              lineHeight: "1.4",
                            }}
                          >
                            {dataItems[index + 4].heading}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Button
              onClick={handleCopyLink}
              variant="contained"
              sx={{
                width: "87%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "30px", // Adjust as needed
                marginBottom: "5px",
                // backgroundColor: "#0F6518",
                background: "linear-gradient(90deg,#24ee89,#9fe871)",

                "&:hover": {
                  // backgroundColor: "#0F6518",
                  background:
                    "linear-gradient(90deg,#24ee89,#9fe871)",
                },
                color: "black",
                fontWeight: "bold",
                borderRadius: "20px", // Adjust as needed
              }}
            >
              Invitation Link
            </Button>
            <div>
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={(e) => {
                    // Only handle clicks if the option label is not "Copy invitation code"
                    if (option.label !== "Copy invitation code") {
                      handleOptionClick(option);
                    }
                  }}
                  sx={{
                    backgroundColor: "#323738",
                    "&:hover": {
                      // backgroundColor: "#0F6518",
                      background: "#323738",
                    },
                    px: 2.1,
                    py: isSmallScreen2 ? "10px" : isSmallScreen ? "12px" : 2.2,
                    width: "calc(100% - 30px)",
                    mx: "auto",
                    my: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      "&.MuiListItemIcon-root": {
                        minWidth: isSmallScreen2 ? "26px" : "36px",
                      },
                    }}
                  >
                    {typeof option.image === "string" ? (
                      <img
                        src={option.image}
                        alt="icon"
                        style={{
                          width: isSmallScreen2 ? index === 6 ? 26 : 19 : isSmallScreen ? index === 6 ? 30 : 23 : index === 6 ? 35 : 28,
                          marginRight: isSmallScreen ? 1 : index === 6 ? 2 : 8,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: isSmallScreen ? 26 : 32,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {option.image}
                      </span>
                    )}
                  </ListItemIcon>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#ffffff",
                      flex: 1,
                      fontSize: isSmallScreen2
                        ? "0.75rem"
                        : isSmallScreen
                          ? "0.8rem"
                          : "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // Aligns child elements to the ends
                    }}
                  >
                    <span>{option.label}</span>
                    {option.label === "Copy invitation code" && userData && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="inherit"
                          sx={{
                            color: "#ffffff",
                            fontSize: isSmallScreen ? 9.4 : 11,
                            marginLeft: 2,
                            marginRight: 0.5,
                          }}
                        >
                          {userData.inviteCode}
                        </Typography>
                        {/* <IconButton
                          size="small"
                          sx={{color:"red"}}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents the click event from bubbling up to the MenuItem
                            handleOptionClick(option); // Call the click handler for the option
                          }}
                        > */}
                        <img
                          src="/assets/icons/copy2.svg"
                          alt="logo"
                          style={{
                            width: isSmallScreen2
                              ? "13px"
                              : isSmallScreen
                                ? "15px"
                                : "16px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents the click event from bubbling up to the MenuItem
                            handleOptionClick(option); // Call the click handler for the option
                          }}
                        />
                        {/* <ContentCopyIcon fontSize="small" /> */}
                        {/* </IconButton> */}
                      </Box>
                    )}
                  </Typography>

                  {option.label !== "Copy invitation code" && (
                    <ListItemIcon
                      style={{
                        marginLeft: "auto",
                        color: "#ffffff",
                        marginRight: "-20px",
                      }}
                    >
                      <ArrowForwardIosRoundedIcon
                        sx={{
                          fontSize: isSmallScreen2
                            ? "1.1rem"
                            : isSmallScreen
                              ? "1.2rem"
                              : "1.4rem",
                        }}
                      />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </div>

            <Grid
              mt={4}
              sx={{
                backgroundColor: "#323738",
                borderRadius: "8px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "calc(100% - 30px)",
                marginBottom: "50px",
                padding: "10px",
                "&.MuiGrid-root": {
                  marginTop: 0,
                },
              }}
            >
              {/* Header */}
              <Grid container alignItems="center" sx={{ marginBottom: "5px" }}>
                <Grid item sx={{ marginRight: "5px" }}>
                  <img
                    src="/assets/icons/promotionIcons/promotiondata.svg"
                    alt="camera"
                    style={{
                      width: "22px",
                      height: "22px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h7"
                    sx={{
                      fontWeight: "bold",
                      color: "#ffffff",
                      fontSize: isSmallScreen2
                        ? "0.75rem"
                        : isSmallScreen
                          ? "0.8rem"
                          : "15px",
                    }}
                  >
                    { }
                    promotion data
                  </Typography>
                </Grid>
              </Grid>

              {/* Content */}
              <Grid container spacing={1} sx={{}}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      borderRight: "1px solid #454037",
                      mt: "5px",
                      fontSize: isSmallScreen2
                        ? "13px"
                        : isSmallScreen
                          ? "14px"
                          : "16px",
                    }}
                  >
                    {thisWeekCommission}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B3BEC1",
                      borderRight: "1px solid #454037",
                      fontSize: isSmallScreen2
                        ? "11px"
                        : isSmallScreen
                          ? "12px"
                          : "13px",
                    }}
                  >
                    {data[0].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      mt: "5px",
                      fontSize: isSmallScreen2
                        ? "13px"
                        : isSmallScreen
                          ? "14px"
                          : "16px",
                    }}
                  >
                    {lifetimeCommission}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B3BEC1",
                      fontSize: isSmallScreen2
                        ? "11px"
                        : isSmallScreen
                          ? "12px"
                          : "13px",
                    }}
                  >
                    {data[1].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      borderRight: "1px solid #454037",
                      mt: "5px",
                      fontSize: isSmallScreen2
                        ? "13px"
                        : isSmallScreen
                          ? "14px"
                          : "16px",
                    }}
                  >
                    {totalDirectSubordinates}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B3BEC1",
                      borderRight: "1px solid #454037",
                      fontSize: isSmallScreen2
                        ? "11px"
                        : isSmallScreen
                          ? "12px"
                          : "13px",
                    }}
                  >
                    {data[2].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      mt: "5px",
                      fontSize: isSmallScreen2
                        ? "13px"
                        : isSmallScreen
                          ? "14px"
                          : "16px",
                    }}
                  >
                    {totalAllSubordinates}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B3BEC1",
                      fontSize: isSmallScreen2
                        ? "11px"
                        : isSmallScreen
                          ? "12px"
                          : "13px",
                    }}
                  >
                    {data[3].heading}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* content end */}
          </Box>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          {children}
        </Box>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <BottomNavigationArea />
      </Mobile>
    </>
  );
};

export default Promotion;
