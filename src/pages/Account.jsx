import React, { useContext, useEffect, useState } from "react";
import Mobile from "../components/layout/Mobile";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useAuth } from "../context/AuthContext";
import { MenuList, MenuItem, ListItemText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BottomNavigationArea from "../components/common/BottomNavigation";
import { UserContext } from "../context/UserState";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingLogo from "../components/utils/LodingLogo";
const ImageSubtitleGrid = ({ imageSrc, subtitle1, subtitle2, onClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(390));
  // const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(340));
  return (
    <Grid
      container
      onClick={onClick}
      sx={{
        backgroundColor: "#323738",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "72px", // Fixed height instead of percentage
        borderRadius: "5px",
        px: 1.5,
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <Grid
        item
        xs={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
        }}
      >
        <img
          src={imageSrc}
          alt="icon"
          style={{
            width: subtitle1 === "Game History" || subtitle1 === "Transaction" ? isSmallScreen ? "25px" : "31px" : isSmallScreen ? "30px" : "36px",
            objectFit: "contain",
          }}
        />
      </Grid> 
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pl: 1,
        }}
      >
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: isSmallScreen ? "13.5px" : "15px",
            // mb: 0.5,
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          {subtitle1}
        </Typography>
        <Typography
          sx={{
            color: "#B3BEC1",
            fontSize: isSmallScreen ? "12px" : "13px",
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          {subtitle2}
        </Typography>
      </Grid>
    </Grid>
  );
};

const images = [
  {
    url: (<svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M5 32.2035V27.8035C5 25.2035 7.125 23.0535 9.75 23.0535C14.275 23.0535 16.125 19.8535 13.85 15.9285C12.55 13.6785 13.325 10.7535 15.6 9.4535L19.925 6.9785C21.9 5.8035 24.45 6.5035 25.625 8.4785L25.9 8.9535C28.15 12.8785 31.85 12.8785 34.125 8.9535L34.4 8.4785C35.575 6.5035 38.125 5.8035 40.1 6.9785L44.425 9.4535C46.7 10.7535 47.475 13.6785 46.175 15.9285C43.9 19.8535 45.75 23.0535 50.275 23.0535C52.875 23.0535 55.025 25.1785 55.025 27.8035V32.2035C55.025 34.8035 52.9 36.9535 50.275 36.9535C45.75 36.9535 43.9 40.1535 46.175 44.0785C47.475 46.3535 46.7 49.2535 44.425 50.5535L40.1 53.0285C38.125 54.2035 35.575 53.5035 34.4 51.5285L34.125 51.0535C31.875 47.1285 28.175 47.1285 25.9 51.0535L25.625 51.5285C24.45 53.5035 21.9 54.2035 19.925 53.0285L15.6 50.5535C14.5102 49.926 13.714 48.8919 13.3859 47.6779C13.0578 46.464 13.2247 45.1695 13.85 44.0785C16.125 40.1535 14.275 36.9535 9.75 36.9535C7.125 36.9535 5 34.8035 5 32.2035Z"
        fill="#9FE871"
      />
      <path
        d="M30 38.125C32.1549 38.125 34.2215 37.269 35.7452 35.7452C37.269 34.2215 38.125 32.1549 38.125 30C38.125 27.8451 37.269 25.7785 35.7452 24.2548C34.2215 22.731 32.1549 21.875 30 21.875C27.8451 21.875 25.7785 22.731 24.2548 24.2548C22.731 25.7785 21.875 27.8451 21.875 30C21.875 32.1549 22.731 34.2215 24.2548 35.7452C25.7785 37.269 27.8451 38.125 30 38.125Z"
        fill="#24EE89"
      />
    </svg>),
    caption: "Settings"
  },
  {
    url: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none" >
      <path opacity="0.4" d="M40.6016 9.12109H19.4016C13.2266 9.12109 8.22656 14.1461 8.22656 20.2961V43.8211C8.22656 49.9711 13.2516 54.9961 19.4016 54.9961H40.5766C46.7516 54.9961 51.7516 49.9711 51.7516 43.8211V20.2961C51.7766 14.1211 46.7516 9.12109 40.6016 9.12109Z" fill="#9FE871" />
      <path d="M35.875 5H24.125C21.525 5 19.4 7.1 19.4 9.7V12.05C19.4 14.65 21.5 16.75 24.1 16.75H35.875C38.475 16.75 40.575 14.65 40.575 12.05V9.7C40.6 7.1 38.475 5 35.875 5ZM37.5 32.375H20C18.975 32.375 18.125 31.525 18.125 30.5C18.125 29.475 18.975 28.625 20 28.625H37.5C38.525 28.625 39.375 29.475 39.375 30.5C39.375 31.525 38.525 32.375 37.5 32.375ZM30.95 42.375H20C18.975 42.375 18.125 41.525 18.125 40.5C18.125 39.475 18.975 38.625 20 38.625H30.95C31.975 38.625 32.825 39.475 32.825 40.5C32.825 41.525 31.975 42.375 30.95 42.375Z" fill="#24EE89" />
    </svg>
    ), caption: "Feedback"
  },
  // {
  //   url: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
  //     <path d="M21 34H12V50.5C12 52.9853 14.0146 55 16.5 55C18.9854 55 21 52.9853 21 50.5V34Z" fill="#24ee89" />
  //     <path opacity="0.6" d="M23.75 15H11.25C9.17887 15 7.5 16.6789 7.5 18.75V31.25C7.5 33.3211 9.17887 35 11.25 35H25" fill="#24ee89" />
  //     <path opacity="0.6" d="M42.5 17.5H45C49.1421 17.5 52.5 20.8579 52.5 25C52.5 29.1421 49.1421 32.5 45 32.5H42.5" fill="#24ee89" />
  //     <path d="M42.2432 42.5C42.3851 42.5 42.5 42.3849 42.5 42.2428V7.75724C42.5 7.61518 42.3851 7.5 42.2432 7.5H37.9706C28.3219 7.5 20.5 15.3351 20.5 25C20.5 34.6649 28.3219 42.5 37.9706 42.5H42.2432Z" fill="#24ee89" />
  //   </svg>
  //   ), caption: "Notification"
  // },
  {
    url: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none">
      <g id="Group 1420069177">
        <path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M0.501486 25.2499C0.501486 31.7163 2.98132 37.6138 7.0576 42.0809L7.05658 42.0819C3.94138 45.3931 0 45.8223 0 45.8223C5.87741 49.7199 12.9648 51.9961 20.594 51.9961C26.8205 51.9961 32.686 50.4799 37.8274 47.8037C46.2308 43.6469 51.9961 35.1102 51.9961 25.2499C51.9961 11.3048 40.4686 0 26.2487 0C12.029 0 0.501486 11.3048 0.501486 25.2499ZM38.3417 13.6638C45.0029 20.3143 45.0029 31.0966 38.3417 37.747C31.6808 44.3975 20.8812 44.3975 14.22 37.747C9.51028 33.0448 8.13334 26.2774 10.0841 20.3648C10.2825 19.7185 10.5019 19.0869 10.7447 18.4688C10.5338 18.9093 10.3426 19.3569 10.1711 19.8103C11.3425 16.3535 13.3074 13.1056 16.0669 10.3506C19.6652 6.75799 24.1026 4.51343 28.7496 3.61719L28.7484 3.6188L28.7499 3.61854C28.7366 3.63528 27.1093 5.67989 27.2311 8.70353C31.2743 8.92724 35.2529 10.5801 38.3417 13.6638Z" fill="#9FE871" />
        <path id="Vector" opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M38.3417 37.747C45.0029 31.0966 45.0029 20.3143 38.3417 13.6638C35.2529 10.5801 31.2743 8.92724 27.2311 8.70353C27.1091 5.67485 28.742 3.62845 28.75 3.61847L28.7484 3.6188L28.7496 3.61719C24.1026 4.51343 19.6652 6.75799 16.0669 10.3506C13.3074 13.1056 11.3425 16.3535 10.1711 19.8103C10.3426 19.3569 10.5338 18.9093 10.7447 18.4688C10.5019 19.0869 10.2825 19.7185 10.0841 20.3648C8.13334 26.2774 9.51028 33.0448 14.22 37.747C20.8812 44.3975 31.6808 44.3975 38.3417 37.747Z" fill="#24EE89" />
        <path id="Vector_2" fill-rule="evenodd" clip-rule="evenodd" d="M17.625 23.9571V26.0727V27.4819C17.625 28.8886 18.767 30.0288 20.176 30.0288C21.5849 30.0288 22.7268 28.8886 22.7268 27.4819V26.0706V23.9571C22.7268 22.5507 21.5849 21.4102 20.176 21.4102C18.767 21.4102 17.625 22.5507 17.625 23.9571Z" fill="#24EE89" />
        <path id="Vector_3" fill-rule="evenodd" clip-rule="evenodd" d="M30.25 23.9571V26.0727V27.4819C30.25 28.8886 31.3921 30.0288 32.8009 30.0288C34.2098 30.0288 35.3519 28.8886 35.3519 27.4819V26.0706V23.9571C35.3519 22.5507 34.2098 21.4102 32.8009 21.4102C31.3921 21.4102 30.25 22.5507 30.25 23.9571Z" fill="#24EE89" />
      </g>
    </svg>
    ),
    caption: "Customer Service",
  },
  {
    url: (<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.4"
        d="M30 13.2541V53.3291C29.575 53.3291 29.125 53.2541 28.775 53.0541L28.675 53.0041C23.875 50.3791 15.5 47.6291 10.075 46.9041L9.35 46.8041C6.95 46.5041 5 44.2541 5 41.8541V11.6541C5 8.67913 7.425 6.42913 10.4 6.67913C15.65 7.10413 23.6 9.75413 28.05 12.5291L28.675 12.9041C29.05 13.1291 29.525 13.2541 30 13.2541Z"
        fill="#9FE871"
      />
      <path
        d="M55 11.6739V41.8489C55 44.2489 53.05 46.4988 50.65 46.7989L49.825 46.8988C44.375 47.6239 35.975 50.3988 31.175 53.0489C30.85 53.2488 30.45 53.3239 30 53.3239V13.2489C30.475 13.2489 30.95 13.1239 31.325 12.8989L31.75 12.6239C36.2 9.82385 44.175 7.14885 49.425 6.69885H49.575C52.55 6.44885 55 8.67385 55 11.6739ZM19.375 23.0939H13.75C12.725 23.0939 11.875 22.2439 11.875 21.2189C11.875 20.1939 12.725 19.3439 13.75 19.3439H19.375C20.4 19.3439 21.25 20.1939 21.25 21.2189C21.25 22.2439 20.4 23.0939 19.375 23.0939ZM21.25 30.5939H13.75C12.725 30.5939 11.875 29.7439 11.875 28.7189C11.875 27.6939 12.725 26.8439 13.75 26.8439H21.25C22.275 26.8439 23.125 27.6939 23.125 28.7189C23.125 29.7439 22.275 30.5939 21.25 30.5939Z"
        fill="#24EE89"
      />
    </svg>), caption: "Beginers's Guide"
  },
  {
    url: (
      <svg id="icon-about" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
        <path d="M48.3242 14.2031L32.6492 5.75313C30.9992 4.85312 28.9992 4.85312 27.3492 5.75313L11.6742 14.2031C10.5242 14.8281 9.82422 16.0281 9.82422 17.4031C9.82422 18.7531 10.5242 19.9781 11.6742 20.6031L27.3492 29.0531C28.1742 29.5031 29.0992 29.7281 29.9992 29.7281C30.8992 29.7281 31.8242 29.5031 32.6492 29.0531L48.3242 20.6031C49.4742 19.9781 50.1742 18.7781 50.1742 17.4031C50.1742 16.0281 49.4742 14.8281 48.3242 14.2031Z" fill="#24EE89"></path>
        <path opacity="0.4" d="M24.775 31.9773L10.175 24.6773C9.05 24.1273 7.75 24.1773 6.7 24.8273C5.625 25.5023 5 26.6273 5 27.8773V41.6523C5 44.0273 6.325 46.1773 8.45 47.2523L23.025 54.5523C23.5699 54.8224 24.1742 54.9503 24.7818 54.9241C25.3894 54.8979 25.9804 54.7184 26.5 54.4023C27.575 53.7523 28.2 52.6023 28.2 51.3523V37.5773C28.225 35.1773 26.9 33.0273 24.775 31.9773ZM53.3 24.8273C52.225 24.1773 50.925 24.1023 49.825 24.6773L35.25 31.9773C33.125 33.0523 31.8 35.1773 31.8 37.5773V51.3523C31.8 52.6023 32.425 53.7523 33.5 54.4023C34.0196 54.7184 34.6106 54.8979 35.2182 54.9241C35.8258 54.9503 36.4301 54.8224 36.975 54.5523L51.55 47.2523C53.675 46.1773 55 44.0523 55 41.6523V27.8773C55 26.6273 54.375 25.5023 53.3 24.8273Z" fill="#9FE871"></path>

      </svg>
    ), caption: "About us"
  },
];

const vipLevelImages = [
  "/assets/vipIcons/vip-zero.webp", // Level 0 (default)
  "/assets/vipIcons/vip1.webp", // Level 1 (Bronze)
  "/assets/vipIcons/vip2.webp", // Level 2 (Silver)
  "/assets/vipIcons/vip3.webp", // Level 3 (Gold)
  "/assets/vipIcons/vip4.webp", // Level 4 (Platinum)
  "/assets/vipIcons/vip5.webp", // Level 5 (Diamond)
  "/assets/vipIcons/vip6.webp", // Level 6 (Diamond)
  "/assets/vipIcons/vip7.webp", // Level 7 (Diamond)
  "/assets/vipIcons/vip8.webp", // Level 8 (Diamond)
  "/assets/vipIcons/vip9.webp", // Level 9 (Diamond)
  "/assets/vipIcons/vip10.webp", // Level 10 (Diamond)
];

const Account = ({ children }) => {
  // const [lastAchievement, setLastAchievement] = useState(null);
  const [userVipData, setUserVipData] = useState(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const { getUserData, userData, userWallet, getWalletBalance } =
    useContext(UserContext);
  // //console.log(userData)
  const { axiosInstance, isAdmin, logout, isAgent } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(390));
  // const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(340));
  const [logoLoading, setLogoLoading] = useState(true);

  // Critical addition: Ensure user data is always fetched when component mounts
  useEffect(() => {
    // Always fetch fresh user data when Account component mounts
    getUserData();
    // Also refresh wallet balance
    getWalletBalance();
  }, []);  // Empty dependency array ensures this only runs once on mount


  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoLoading(false); // Hide loading after 2 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup
  }, []);
  const handleCopy = () => {
    const tempInput = document.createElement("textarea");
    tempInput.value = subtitle;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const fetchVIPData = async () => {
    try {
      const response = await axiosInstance.get("/api/vip/experience");
      if (response.data.success && response.data.data.length > 0) {
        setUserVipData(response.data.data[0]); // Assuming first user data is relevant
      }
    } catch (error) {
      console.error("Error fetching VIP experience:", error);
    }
  };
  useEffect(() => {
    fetchVIPData();
  }, []);

  const getImageForAchievement = () => {
    const level = userVipData?.vipLevel || 0;
    return vipLevelImages[Math.min(level, vipLevelImages.length - 1)];
  };

  const handleRefresh = () => {
    getUserData();
    getWalletBalance();
  };
  const handlePasswordSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/user/verify-password', {
        uid: userData.uid, // Assuming userData has the user's ID
        password: password
      });

      if (response.data.success) {
        // Password verified successfully
        const token = Math.random().toString(36).substr(2); // Simple token generation
        sessionStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
        setPassword("");
        setPasswordError("");
      } else {
        // Password verification failed
        setPasswordError("Incorrect password");
      }

    }
    catch (error) {

    }
  }
const options = [
    // {
    //   label: "Notification",
    //   icon: (<svg
    //     viewBox="0 0 61 60"
    //     fill="none"
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="60"
    //   // height="24"
    //   >
    //     <path
    //       opacity="0.4"
    //       d="M43 51.25H18C10.5 51.25 5.5 47.5 5.5 38.75V21.25C5.5 12.5 10.5 8.75 18 8.75H43C50.5 8.75 55.5 12.5 55.5 21.25V38.75C55.5 47.5 50.5 51.25 43 51.25Z"
    //       fill="#24ee89"
    //     />
    //     <path
    //       d="M30.4987 32.1818C28.3987 32.1818 26.2737 31.5318 24.6487 30.2068L16.8237 23.9568C16.4598 23.6408 16.2319 23.1966 16.1876 22.7167C16.1433 22.2369 16.286 21.7584 16.5858 21.3812C16.8857 21.0039 17.3196 20.757 17.7971 20.6919C18.2746 20.6268 18.7588 20.7486 19.1487 21.0318L26.9737 27.2818C28.8737 28.8068 32.0987 28.8068 33.9987 27.2818L41.8237 21.0318C42.6237 20.3818 43.8237 20.5068 44.4487 21.3318C45.0987 22.1318 44.9737 23.3318 44.1487 23.9568L36.3237 30.2068C34.7237 31.5318 32.5987 32.1818 30.4987 32.1818Z"
    //       fill="#24ee89"
    //     />
    //   </svg>),
    //   subLabel: null,
    //   onClick: () => navigate("/account/notification"),
    // },
    {
      label: "Gifts",
      icon: (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 61 60"
        fill="none"
        width="60"
      // height="24"
      >
        <path
          opacity="0.4"
          d="M50.4219 25V45C50.4219 52.5 47.9219 55 40.4219 55H20.4219C12.9219 55 10.4219 52.5 10.4219 45V25H50.4219Z"
          fill="#9FE871"
        />
        <path
          d="M54.25 17.5V20C54.25 22.75 52.925 25 49.25 25H11.75C7.925 25 6.75 22.75 6.75 20V17.5C6.75 14.75 7.925 12.5 11.75 12.5H49.25C52.925 12.5 54.25 14.75 54.25 17.5Z"
          fill="#24EE89"
        />
        <path
          opacity="0.4"
          d="M29.5993 12.5013H15.7993C15.3882 12.0554 15.1663 11.4674 15.1803 10.8611C15.1943 10.2548 15.4431 9.67767 15.8743 9.25125L19.4243 5.70125C19.8736 5.25698 20.48 5.00781 21.1118 5.00781C21.7437 5.00781 22.35 5.25698 22.7993 5.70125L29.5993 12.5013ZM45.1818 12.5013H31.3818L38.1818 5.70125C38.6311 5.25698 39.2375 5.00781 39.8693 5.00781C40.5012 5.00781 41.1075 5.25698 41.5568 5.70125L45.1068 9.25125C46.0068 10.1513 46.0318 11.5763 45.1818 12.5013Z"
          fill="#9FE871"
        />
        <path
          opacity="0.6"
          d="M22.8516 25V37.85C22.8516 39.85 25.0516 41.025 26.7266 39.95L29.0766 38.4C29.4848 38.1312 29.9628 37.9879 30.4516 37.9879C30.9403 37.9879 31.4184 38.1312 31.8266 38.4L34.0516 39.9C34.427 40.1503 34.8634 40.2939 35.3141 40.3157C35.7648 40.3374 36.2129 40.2364 36.6107 40.0234C37.0085 39.8104 37.341 39.4934 37.5727 39.1062C37.8045 38.719 37.9268 38.2762 37.9266 37.825V25H22.8516Z"
          fill="#24EE89"
        />
      </svg>),
      subLabel: null,
      onClick: () => navigate("/gift-coupon"),
    },
    // {
    //   label: "Game statistics",
    //   icon: (<svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 61 60"
    //     fill="none"
    //     width="60"
    //   // height="24"
    //   >
    //     <path
    //       opacity="0.4"
    //       d="M53 56.875H8C6.975 56.875 6.125 56.025 6.125 55C6.125 53.975 6.975 53.125 8 53.125H53C54.025 53.125 54.875 53.975 54.875 55C54.875 56.025 54.025 56.875 53 56.875Z"
    //       fill="#24ee89"
    //     />
    //     <path
    //       d="M14.5 20.9475H10.5C9.125 20.9475 8 22.0725 8 23.4475V44.9975C8 46.3725 9.125 47.4975 10.5 47.4975H14.5C15.875 47.4975 17 46.3725 17 44.9975V23.4475C17 22.0475 15.875 20.9475 14.5 20.9475ZM32.5 12.9775H28.5C27.125 12.9775 26 14.1025 26 15.4775V45.0025C26 46.3775 27.125 47.5025 28.5 47.5025H32.5C33.875 47.5025 35 46.3775 35 45.0025V15.4775C35 14.1025 33.875 12.9775 32.5 12.9775ZM50.5 5H46.5C45.125 5 44 6.125 44 7.5V45C44 46.375 45.125 47.5 46.5 47.5H50.5C51.875 47.5 53 46.375 53 45V7.5C53 6.125 51.875 5 50.5 5Z"
    //       fill="#24ee89"
    //     />
    //   </svg>),
    //   subLabel: null,
    //   onClick: () => navigate("/account/game-statistic"),
    // },
    {
      label: "Language",
      icon: (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 61 60"
        fill="none"
        width="60"
      // height="40"
      >
        <path
          opacity="0.4"
          d="M19.6217 52.2742C19.5467 52.2742 19.4467 52.3242 19.3717 52.3242C14.5217 49.9242 10.5717 45.9492 8.14672 41.0992C8.14672 41.0242 8.19672 40.9242 8.19672 40.8492C11.2467 41.7492 14.3967 42.4242 17.5217 42.9492C18.0717 46.0992 18.7217 49.2242 19.6217 52.2742ZM52.8492 41.1242C50.3742 46.0992 46.2492 50.1242 41.2242 52.5492C42.1742 49.3742 42.9742 46.1742 43.4992 42.9492C46.6492 42.4242 49.7492 41.7492 52.7992 40.8492C52.7742 40.9492 52.8492 41.0492 52.8492 41.1242ZM53.0492 19.2742C49.8992 18.3242 46.7242 17.5492 43.4992 16.9992C42.9742 13.7742 42.1992 10.5742 41.2242 7.44922C46.3992 9.92422 50.5742 14.0992 53.0492 19.2742ZM19.6242 7.72172C18.7242 10.7717 18.0742 13.8717 17.5492 17.0217C14.3242 17.5217 11.1242 18.3217 7.94922 19.2717C10.3742 14.2467 14.3992 10.1217 19.3742 7.64672C19.4492 7.64672 19.5492 7.72172 19.6242 7.72172Z"
          fill="#9FE871"
        />
        <path
          d="M39.23 16.475C33.43 15.825 27.58 15.825 21.78 16.475C22.405 13.05 23.205 9.625 24.33 6.325C24.38 6.125 24.355 5.975 24.38 5.775C26.355 5.3 28.38 5 30.505 5C32.605 5 34.655 5.3 36.605 5.775C36.63 5.975 36.63 6.125 36.68 6.325C37.805 9.65 38.605 13.05 39.23 16.475ZM16.975 38.73C13.525 38.105 10.125 37.305 6.825 36.18C6.625 36.13 6.475 36.155 6.275 36.13C5.8 34.155 5.5 32.13 5.5 30.005C5.5 27.905 5.8 25.855 6.275 23.905C6.475 23.88 6.625 23.88 6.825 23.83C10.15 22.73 13.525 21.905 16.975 21.28C16.35 27.08 16.35 32.93 16.975 38.73ZM55.5 30.005C55.5 32.13 55.2 34.155 54.725 36.13C54.525 36.155 54.375 36.13 54.175 36.18C50.85 37.28 47.45 38.105 44.025 38.73C44.675 32.93 44.675 27.08 44.025 21.28C47.45 21.905 50.875 22.705 54.175 23.83C54.375 23.88 54.525 23.905 54.725 23.905C55.2 25.88 55.5 27.905 55.5 30.005ZM39.23 43.525C38.605 46.975 37.805 50.375 36.68 53.675C36.63 53.875 36.63 54.025 36.605 54.225C34.655 54.7 32.605 55 30.505 55C28.38 55 26.355 54.7 24.38 54.225C24.355 54.025 24.38 53.875 24.33 53.675C23.2429 50.3557 22.3908 46.964 21.78 43.525C24.68 43.85 27.58 44.075 30.505 44.075C33.43 44.075 36.355 43.85 39.23 43.525ZM39.9075 39.4075C33.6606 40.1964 27.3394 40.1964 21.0925 39.4075C20.3037 33.1606 20.3037 26.8394 21.0925 20.5925C27.3394 19.8037 33.6606 19.8037 39.9075 20.5925C40.6964 26.8394 40.6964 33.1606 39.9075 39.4075Z"
          fill="#24EE89"
        />
      </svg>),
      subLabel: "English",
      onClick: () => navigate("/account/language"),
    },
    isAdmin
      ? {
        label: "Administrative Area",
        icon: "assets/icons/management.webp",
        onClick: () => {
          handleTokenCheck()
        },
      }
      : null,
    isAgent
      ? {
        label: "Agent Dashboard",
        icon: "assets/icons/management.webp",
        onClick: () => {
          navigate("/agent/agent-dashboard")
        },
      }
      : null,
  ].filter(Boolean);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleTokenCheck = () => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard")
    }
    else { setOpenPasswordDialog(true); }

  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem("adminToken");
    navigate("/login");
    setOpen(false);
  };

  const handleImageClick = (index) => {
    switch (index) {
      case 0: // Settings
        navigate("/account/settings");
        break;
      case 1: // Feedback
        navigate("/account/feedback");
        break;
      case 2: // Notifications
        navigate("/customer-service");
        break;
      case 3: // 24/7 Customer service
        // navigate("/customer-service");
        break;
      case 4: // 24/7 Customer service
        // navigate("/customer-service");
        break;
      case 5: // 24/7 Customer service
        navigate("/account/about-us");
        break;
      default:
        //console.log(`Clicked Image ${index + 1}`);
        break;
    }
  };

  // const getImageForAchievement = () => {
  //   if (!lastAchievement) return "../../assets/vipIcons/vip-zero.webp";

  //   switch (lastAchievement) {
  //     case "Bronze":
  //       return "../../assets/vipIcons/vip1.webp";
  //     case "Silver":
  //       return "../../assets/vipIcons/vip2.webp";
  //     case "Gold":
  //       return "../../assets/vipIcons/vip3.webp";
  //     case "Platinum":
  //       return "../../assets/vipIcons/vip4.webp";
  //     case "Diamond":
  //       return "../../assets/vipIcons/vip5.webp";
  //     default:
  //       return "../../assets/vipIcons/vip-zero.webp";
  //   }
  // };

  const subtitle = `${userData ? userData.uid : 0}`;

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{
            backgroundColor: "#232626", // Base background color
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#232626",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#232626",
            },
          }}
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
              <LoadingLogo websiteName="World 10 Game" />
            </div>
          )}
          <Box flexGrow={1}>
            <Grid
              container
              sx={{
                background:
                  "#323738",
                borderRadius: "0 0 20px 20px",
                px: "20px",
                pb: "10px",
                pt: "30px",
              }}
            >
              <Grid
                item
                xs={3}
                align="left"
                onClick={() =>
                  navigate("/account/avatar-change", {
                    state: { avatar: userData.avatar },
                  })
                }
              >
                <Avatar
                  src={userData?.avatar}
                  sx={{
                    width: isSmallScreen ? 70 : 76,
                    height: isSmallScreen ? 70 : 76,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={8}
                container
                align="left"
                direction="column"
                // justifyContent="space-between"
                sx={{
                  gap: "3px",
                }}
              >
                <Grid
                  item
                  align="left"
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Typography
                    variant="caption"
                    align="center"
                    color="white"
                    fontSize={isSmallScreen ? 15 : 16}
                  >
                    {userData ? userData.userName : "Loading.."}
                  </Typography>{" "}
                  <img
                    src={getImageForAchievement()}
                    alt="Achievement"
                    width="22%"
                  // height="80%",
                  />
                </Grid>
                <Grid
                  item
                  container
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    borderRadius: "50px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    padding: "0 8px",
                    height: "24%",
                    backgroundColor: "rgb(221,144,56)",
                    width: isSmallScreen ? "50%" : "55%",
                  }}
                >
                  <Grid
                    item
                    xs={8}
                    container
                    alignItems="center"
                    direction="row"
                    display="flex"
                  // mb={1}
                  >
                    <Typography
                      variant="caption"
                      fontSize={isSmallScreen ? 11 : 12}
                      align="left"
                      color="white"
                    >
                      {`UID`}
                    </Typography>
                    <Box
                      sx={{
                        height: "10px",
                        borderLeft: "1px solid white",
                        mx: 1,
                      }}
                    />
                    <Typography
                      variant="caption"
                      align="left"
                      color="white"
                      fontSize={isSmallScreen ? 11 : 12}
                    >
                      {`${userData ? userData.uid : 0}`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    display="flex"
                  // pb={1}
                  // pr={1} // Adjusted padding to ensure proper alignment
                  >
                    <IconButton onClick={handleCopy} sx={{ p: 0 }}>
                      <img
                        src="/assets/icons/copy.svg"
                        alt="logo"
                        style={{
                          width: isSmallScreen ? "10px" : "11px",
                          marginLeft: "2px",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid item align="left">
                  <Typography
                    variant="caption"
                    sx={{ fontSize: isSmallScreen ? "10px" : "12px" }}
                    align="left"
                    color="white"
                  >{`Last Login: ${userData
                    ? new Date(userData.lastLogin).toLocaleString()
                    : "Loading.."
                    }`}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  height: "100px",
                }}
              ></Grid>
            </Grid>

            <div style={{ position: "relative", marginTop: "-23%", zIndex: 1 }}>
              <Grid
                container
                sx={{
                  background: "linear-gradient(120deg, rgb(48, 76, 65), rgb(50, 56, 56) 100%)",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: "93%", // Decreased width
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{
                      color: "#B3BEC1",
                      fontSize: isSmallScreen ? "13px" : "15px",
                    }}
                  >
                    Total balance
                  </Typography>
                </Grid>

                <Grid item xs={12} align="Left">
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: isSmallScreen ? "15px" : "19px",
                    }}
                  >
                    {`\u20B9${userWallet ? parseFloat(userWallet).toFixed(2) : "Loading"
                      }`}
                    <IconButton onClick={handleRefresh}>
                      <img
                        src="/assets/icons/refreshGrey.webp"
                        alt="logo"
                        style={{
                          width: isSmallScreen ? "17px" : "19px",
                          marginLeft: "2px",
                        }}
                      />
                    </IconButton>
                  </Typography>
                </Grid>
                {/* <Grid sx={{borderBottom:"1px solid red"}}>
                </Grid> */}
                <Grid item xs={12} mt={1}>
                  <Divider sx={{ opacity: 1, bgcolor: "#433e36" }} />
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      py: "2px",
                      "&.MuiGrid-root": {
                        // dont remove this comment it is important
                        marginTop: "0px",
                        width: "100%",
                        ml: 0,
                      },
                    }}
                  >
                    <Grid
                      item
                      xs={3}
                      sx={{
                        displayf: "flex",
                        gap: "5px",
                        "&.MuiGrid-item": {
                          paddingTop: 0,
                          paddingLeft: 0,
                        },
                      }}
                    >
                      <IconButton onClick={() => navigate("/wallet")}>
                        <img
                          src="assets/icons/accWallet.webp"
                          alt="Wallet"
                          width={isSmallScreen ? 29 : 32}
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "500",
                          fontSize: isSmallScreen ? "13px" : "15px",
                        }}
                      >
                        Wallet
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        "&.MuiGrid-item": {
                          paddingTop: 0,
                          paddingLeft: 0,
                        },
                      }}
                    >
                      <IconButton onClick={() => navigate("/wallet/deposit")}>
                        <img
                          src="assets/icons/accDeposit.webp"
                          width={isSmallScreen ? 29 : 32}
                          alt="Deposit"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "500",
                          fontSize: isSmallScreen ? "13px" : "15px",
                        }}
                      >
                        Deposit
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        "&.MuiGrid-item": {
                          paddingTop: 0,
                          paddingLeft: 0,
                        },
                      }}
                    >
                      <IconButton onClick={() => navigate("/wallet/withdraw")}>
                        <img
                          src="assets/icons/accWithdraw.webp"
                          width={isSmallScreen ? 29 : 32}
                          alt="Withdraw"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "500",
                          fontSize: isSmallScreen ? "13px" : "15px",
                        }}
                      >
                        Withdraw
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        "&.MuiGrid-item": {
                          paddingTop: 0,
                          paddingLeft: 0,
                        },
                      }}
                    >
                      <IconButton onClick={() => navigate("/account/vip")}>
                        <img
                          src="assets/icons/VipIcon-3c72b1cc.webp"
                          width={isSmallScreen ? 29 : 32}
                          alt="VIP"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "500",
                          fontSize: isSmallScreen ? "13px" : "15px",
                        }}
                      >
                        VIP
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>

            <Box
              sx={{
                width: "calc(100% - 20px)", // Adjust width to fit the container
                mx: "auto", // Center the box
                my: "15px", // Increase vertical margin for better spacing
                // px: 2, // Add horizontal padding for better alignment
              }}
            >
              <Grid
                container
                spacing={2} // Adds spacing between grid items
                sx={{
                  justifyContent: "center", // Ensures grid is centered
                  "&.MuiGrid-root": {
                    ml: 0,
                    mt: 0,
                    width: "100%",
                  },
                }}
              >
                {/* First Row */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&.MuiGrid-item": {
                      p: "5px",
                    },
                  }}
                >
                  <ImageSubtitleGrid
                    imageSrc="/assets/icons/accGamehistory.webp"
                    subtitle1="Game History"
                    subtitle2="My game history"
                    onClick={() => navigate("/account/bet-history")}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&.MuiGrid-item": {
                      p: "5px",
                    },
                  }}
                >
                  <ImageSubtitleGrid
                    imageSrc="/assets/icons/accTransaction.webp"
                    subtitle1="Transaction"
                    subtitle2="My transaction history"
                    onClick={() => navigate("/account/transaction-history")}
                  />
                </Grid>

                {/* Second Row */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&.MuiGrid-item": {
                      p: "5px",
                    },
                  }}
                >
                  <ImageSubtitleGrid
                    imageSrc="/assets/icons/accDiposithistory.webp"
                    subtitle1="Deposit"
                    subtitle2="My deposit history"
                    onClick={() => navigate("/deposit-history")}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&.MuiGrid-item": {
                      p: "5px",
                    },
                  }}
                >
                  <ImageSubtitleGrid
                    imageSrc="/assets/icons/accWithdrawhistory.webp"
                    subtitle1="Withdraw"
                    subtitle2="My withdraw history"
                    onClick={() => navigate("/withdraw-history")}
                  />
                </Grid>
              </Grid>
            </Box>

            <MenuList
              sx={{
                backgroundColor: "#323738",
                borderRadius: "8px",
                marginLeft: "auto",
                marginRight: "auto",
                pb: "30px",
                width: "calc(100% - 30px)",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {options.map((option, index) =>
                [
                  <MenuItem
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: isSmallScreen ? "28px" : "48px",
                      py: isSmallScreen ? "4px" : "6px",
                      paddingRight: "8px",
                    }}
                    onClick={option.onClick}
                  >
                    {typeof option.icon === "string" ? (
                      <img
                        src={option.icon}
                        alt={option.label}
                        style={{
                          width: isSmallScreen
                            ? index === 2 ? "18px" : "22px"
                            : index === 2 ? "21px" : "27px",
                          marginLeft: isSmallScreen ? index === 2 ? "2px" : "0px" : index === 2 ? "4px" : "0px",
                          marginRight: "8px",
                        }}
                      />) : (
                      <span
                        style={{
                          width: isSmallScreen ? "28px" : "32px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // marginLeft: isSmallScreen ? (index === 2 ? "2px" : "0px") : (index === 2 ? "4px" : "0px"),
                          marginRight: "8px",
                        }}
                      >
                        {option.icon}
                      </span>
                    )}
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: isSmallScreen ? "14px" : "15px", // Explicit font size
                            color: "#ffffff",
                            textAlign: "left",
                          }}
                        >
                          {option.label}
                        </Typography>
                      }
                    // sx={{ textAlign: "left", color: "#ffffff", fontSize: "15px"}}
                    />
                    {option.subLabel && (
                      <ListItemText
                        secondary={option.subLabel}
                        secondaryTypographyProps={{
                          style: { color: "#ffffff", fontSize: "15px" },
                        }}
                      />
                    )}

                    <KeyboardArrowRightIcon style={{ color: "#666666" }} />
                  </MenuItem>,
                  index < options.length - 1 && (
                    <Divider key={`divider-${index}`} />
                  ),
                ].filter(Boolean)
              )}
            </MenuList>
            {openPasswordDialog && (
              <Dialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                PaperProps={{
                  sx: {
                    borderRadius: "16px",
                    width: "calc(100% - 64px)",
                    // maxWidth: "400px",
                    p: 2,
                    m: 0,
                    bgcolor: "#323738",
                    maxWidth: "330px",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    onClick={() => setOpenPasswordDialog(false)}
                    sx={{
                      position: "absolute",
                      right: -8,
                      top: -8,
                      color: "grey.500",
                    }}
                  >
                    {/* <X size={20} /> */}
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 3,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#24ee89",
                        borderRadius: "50%",
                        p: "16px 18px",
                        mb: 2,
                      }}
                    >
                      <LockIcon sx={{ color: "#000000" }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: "#24ee89",
                      }}
                    >
                      Admin area
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        mt: 1,
                      }}
                    >
                      Please enter your login password
                    </Typography>
                  </Box>

                  <DialogContent sx={{ px: 0, pb: 0 }}>
                    <TextField
                      autoFocus
                      fullWidth
                      variant="outlined"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!passwordError}
                      helperText={passwordError}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handlePasswordSubmit();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? (
                              <Visibility sx={{ color: "#24ee89" }} />
                            ) : (
                              <VisibilityOff sx={{ color: "#24ee89" }} />
                            )}
                          </IconButton>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          // color: "#000", // Input text color
                          "& fieldset": {
                            borderColor: "#ccc", // Default border color
                          },
                          "&:hover fieldset": {
                            borderColor: "#ccc", // Border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#24ee89", // Border color when focused
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#999", // Default placeholder color
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#24ee89", // Placeholder color when focused
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#24ee89", // Input text color (grey)
                        },
                      }}
                    />
                  </DialogContent>

                  <DialogActions
                    sx={{
                      px: 0,
                      pb: 0,
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => setOpenPasswordDialog(false)}
                      sx={{
                        borderRadius: "10px",
                        color: "#24ee89",
                        border: "1px solid #24ee89",
                        textTransform: "none",
                        "&:hover": {
                          border: "1px solid #24ee89",
                          bgcolor: "rgba(15, 101, 24, 0.04)",
                        },
                      }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => handlePasswordSubmit()}
                      sx={{
                        borderRadius: "10px",
                        bgcolor: "#24ee89",
                        color: "#000000",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#24ee89",
                          opacity: 0.9,
                        },
                      }}
                      variant="contained"
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>
            )}
            <Grid
              sx={{
                backgroundColor: "#323738",
                marginLeft: "auto",
                marginRight: "auto",
                width: "calc(100% - 30px)",
                padding: "20px 12px",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              <Typography sx={{ color: "#ffffff", textAlign: "left", mb: 2.2 }}>
                Service center
              </Typography>
              <Grid
                container
                // spacing={2}
                // mt={0.5}
                sx={{
                  borderRadius: "8px",
                  ml: 0,
                  // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {images.map((image, index) => (
                  <Grid
                    item
                    xs={4}
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "&.MuiGrid-item": {
                        pl: 0,
                        pt: 0,
                      },
                    }}
                  >
                    <div
                      onClick={() => handleImageClick(index)}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {typeof image.url === "string" ? (
                      <img
                        src={image.url}
                        alt={` ${index + 1}`}
                        style={{
                          width: index === 1 ? "25px" : "32px",
                          borderRadius: "8px",
                          marginTop: index === 1 ? "5px" : index === 2 ? "5px" : index === 0 ? "5px" : "0px"
                        }}
                      />) : (<span
                        style={{
                          width: "32px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // marginLeft: isSmallScreen ? (index === 2 ? "2px" : "0px") : (index === 2 ? "4px" : "0px"),
                          marginRight: "8px",
                        }}
                      >
                        {image.url}
                      </span>
                    )}
                      <Typography
                        variant="caption"
                        align="center"
                        sx={{ marginTop: index === 0?"5px":index === 5?"9px":index === 4?"9px": "2px", color: "#B3BEC1" }}
                      >
                        {image.caption}
                      </Typography>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <IconButton
              onClick={handleClickOpen}
              sx={{
                width: "calc(100% - 30px)",
                border: "1px solid #9FE871",
                borderRadius: "50px",
                marginTop: "8%",
                marginBottom: "30%",
              }}
            >
              <Grid
                container
                alignItems="center"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  src="assets/icons/Vector.svg"
                  alt="Wallet"
                  width="20"
                  height="20"
                />
                <Typography
                  variant="body1"
                  sx={{ marginLeft: "8px", color: "#24EE89" }}
                >
                  Log out
                </Typography>
              </Grid>
            </IconButton>

            {/* logout modal */}
            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="xs"
              PaperProps={{
                sx: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#323738",
                  width: "100%",
                  maxWidth: 330, // Ensures it's not too wide
                  margin: "10px", // Centers the dialog on all screen sizes
                  borderRadius: "15px"
                },
              }}
            >
              <DialogTitle sx={{ textAlign: "center" }}>
                <img
                  src="assets/icons/logout_modal.webp"
                  alt="Wallet"
                  width="80"
                />
              </DialogTitle>
              <DialogContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#ffffff" }}
                >
                  Do you want to log out?
                </Typography>
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingBottom: 2,
                  width: "90%", // Ensures buttons don't overflow
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(180deg, #24ee89, #9fe871)",
                    width: "90%",
                    color: "black",
                    maxWidth: "280px",
                    borderRadius: "50px",
                    textTransform: "none",
                    fontSize: "17px"
                  }}
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#24ee89",
                    borderColor: "#24ee89",
                    width: "90%",
                    maxWidth: "280px",
                    borderRadius: "50px",
                    textTransform: "none",
                    fontSize: "17px",
                    "&:not(style)~:not(style)": {
                      ml: 0,
                    },
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            {/* content end */}
          </Box>

          {children}
        </Box>
        <BottomNavigationArea />
      </Mobile>
    </>
  );
};

export default Account;
