import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTheme, useMediaQuery, Collapse } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserContext } from "../../context/UserState";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Avatar,
  LinearProgress,
  Chip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useSpring, animated } from "@react-spring/web";
import {
  Menu as MenuIcon,
  Public as PublicIcon,
  RequestQuoteOutlined as RequestQuoteOutlinedIcon,
  AdjustOutlined as AdjustOutlinedIcon,
  BuildOutlined as BuildOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Inbox as InboxIcon,
  SportsEsports as SportsEsportsIcon,
  Casino as CasinoIcon,
  SportsBaseball as SportsBaseballIcon,
  ReportProblem as ReportProblemIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  ManageAccounts as ManageAccountsIcon,
  Settings as SettingsIcon,
  CardGiftcard as GiftIcon,
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  ManageHistory as ManageHistoryIcon,
  Help as HelpIcon,
  Update as UpdateIcon,
  ReceiptLong as ReceiptLongIcon,
  BorderColor as BorderColorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Games as GamesIcon,
  AccountTree as AccountTreeIcon,
  Lock as LockIcon,
  EmojiEvents as TournamentIcon,
} from "@mui/icons-material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import BatteryCharging80Icon from "@mui/icons-material/BatteryCharging80";
import AnimationIcon from "@mui/icons-material/Animation";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

const drawerWidth = {
  xs: "100%",
  sm: 280,
  md: 280,
  lg: 280,
};

// Premium Theme configuration
const themeColors = {
  primary: {
    main: "#6366f1",
    light: "#818cf8",
    dark: "#4f46e5",
  },
  background: {
    default: "#0f172a",
    paper: "#1e293b",
    drawer: "#0f172a",
    appBar: "rgba(15, 23, 42, 0.98)",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    disabled: "#64748b",
  },
  border: {
    light: "rgba(148, 163, 184, 0.12)",
  },
  demo: {
    warning: "#f59e0b",
    error: "#ef4444",
  },
  gradient: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
};

// Enhanced styled components with premium design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: themeColors.background.appBar,
  backdropFilter: "blur(24px)",
  borderBottom: `1px solid ${themeColors.border.light}`,
  boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.2)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: themeColors.background.drawer,
    backdropFilter: "blur(24px)",
    borderRight: `1px solid ${themeColors.border.light}`,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    boxShadow: "4px 0 24px 0 rgba(0, 0, 0, 0.15)",
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  overflowX: "hidden",
  height: "calc(100% - 120px)",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(themeColors.primary.main, 0.3),
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: alpha(themeColors.primary.main, 0.5),
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active, disabled }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: active
    ? themeColors.gradient.primary
    : "transparent",
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: disabled
      ? "transparent"
      : active
        ? undefined
        : alpha(themeColors.primary.main, 0.1),
    transform: disabled ? "none" : "translateX(4px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: active ? "4px" : "0px",
    background: themeColors.gradient.secondary,
    transition: "width 0.3s ease",
    borderRadius: "0 4px 4px 0",
  },
  "& .MuiListItemIcon-root": {
    color: disabled
      ? themeColors.text.disabled
      : active
        ? "#ffffff"
        : themeColors.text.secondary,
    minWidth: {
      xs: "40px",
      sm: "44px",
    },
    transition: "color 0.3s ease",
  },
  "& .MuiListItemText-primary": {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: active ? 600 : 500,
    fontSize: {
      xs: "0.875rem",
      sm: "0.9375rem",
    },
    color: disabled
      ? themeColors.text.disabled
      : active
        ? "#ffffff"
        : themeColors.text.secondary,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const AnimatedBadge = animated(Badge);

// Get drawer items function with demo admin restrictions
const getDrawerItems = (accountType, isDemoAdmin) => {
  const demoRestrictedItems = [
    "/admin/upi-setting",
    "/admin/withdrawal-setting",
    "/admin/first-deposit-setting",
    "/admin/other-deposit-setting",
    "/admin/activity-reward",
    "/admin/invitation-bonus",
    "/admin/attendance-bonus",
    "/admin/lucky-streak-setting",
    "/admin/winning-streak-setting",
    "/admin/lucky-spin",
    "/admin/vip-levels",
    "/admin/system-setting",
  ];

  const gameManagementItems = [
    { text: "Wingo Admin", icon: <InboxIcon />, link: "/admin/wingo-admin" },
    { text: "K3 Admin", icon: <CasinoIcon />, link: "/admin/k3-admin" },
    {
      text: "5D Admin",
      icon: <SportsBaseballIcon />,
      link: "/admin/fived-admin",
    },
    // {
    //   text: "Car Race Admin",
    //   icon: <DirectionsBusIcon />,
    //   link: "/admin/car-race-admin",
    // },
  ];

  const rechargeItems = [
    {
      text: "Pending Deposit",
      icon: <PendingActionsIcon />,
      link: "/admin/pending-deposit",
    },
    {
      text: "Approved Deposit",
      icon: <ChecklistIcon />,
      link: "/admin/all-deposit",
    },
  ];

  const withdrawItems = [
    {
      text: "Pending Withdraw",
      icon: <PendingActionsIcon />,
      link: "/admin/pending-withdraw",
    },
    {
      text: "Approved Withdraw",
      icon: <ChecklistIcon />,
      link: "/admin/all-withdraw",
    },
  ];

  const memberItems = [
    {
      text: "Active User",
      icon: <OfflineBoltIcon />,
      link: "/admin/active-users",
    },
    // {
    //   text: "Banned User",
    //   icon: <NotInterestedIcon />,
    //   link: "/admin/banned-users",
    // },
  ];

  const addonItems = [
    {
      text: "Create Giftcode",
      icon: <GiftIcon />,
      link: "/admin/create-giftcode",
    },
    // {
    //   text: "Notifications",
    //   icon: <NotificationsIcon />,
    //   link: "/admin/create-notifications",
    // },
  ];

  const settingsItems = [
    {
      text: "Update",
      icon: isDemoAdmin ? <LockIcon /> : <SettingsIcon />,
      link: "/admin/upi-setting",
      disabled: isDemoAdmin,
    },
    // {
    //   text: "Withdrawal Settings",
    //   icon: isDemoAdmin ? <LockIcon /> : <SyncAltIcon />,
    //   link: "/admin/withdrawal-setting",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "First Deposit Bonus",
    //   icon: isDemoAdmin ? <LockIcon /> : <VolunteerActivismIcon />,
    //   link: "/admin/first-deposit-setting",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Other Deposit Bonus",
    //   icon: isDemoAdmin ? <LockIcon /> : <VolunteerActivismIcon />,
    //   link: "/admin/other-deposit-setting",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Activity Setting",
    //   icon: isDemoAdmin ? <LockIcon /> : <CelebrationIcon />,
    //   link: "/admin/activity-reward",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Inviation Bonus",
    //   icon: isDemoAdmin ? <LockIcon /> : <SelfImprovementIcon />,
    //   link: "/admin/invitation-bonus",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Attendance Bonus",
    //   icon: isDemoAdmin ? <LockIcon /> : <BatteryCharging80Icon />,
    //   link: "/admin/attendance-bonus",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Lucky Streak Setting",
    //   icon: isDemoAdmin ? <LockIcon /> : <SentimentVerySatisfiedIcon />,
    //   link: "/admin/lucky-streak-setting",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Winning Streak Setting",
    //   icon: isDemoAdmin ? <LockIcon /> : <MilitaryTechIcon />,
    //   link: "/admin/winning-streak-setting",
    //   disabled: isDemoAdmin,
    // },
    // {
    //   text: "Lucky Spin",
    //   icon: isDemoAdmin ? <LockIcon /> : <AnimationIcon />,
    //   link: "/admin/lucky-spin",
    //   disabled: isDemoAdmin,
    // },
  ];

  const allItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },

    {
      text: "Manage Games",
      icon: <SportsEsportsIcon />,
      subItems: gameManagementItems,
    },
    // {
    //   text: "Illegal Bets",
    //   icon: <ReportProblemIcon />,
    //   link: "/admin/illegal-bets",
    // },
    // {
    //   text: "Profit/Loss",
    //   icon: <MonetizationOnIcon />,
    //   link: "/admin/profit-loss",
    // },
    // {
    //   text: "Tournament",
    //   icon: <TournamentIcon />,
    //   link: "/admin/tournament-management",
    // },
    // {
    //   text: "Agent Performance",
    //   icon: <SupportAgentIcon />,
    //   link: "/admin/agent-performance",
    // },
    // { text: "IP Records", icon: <RoomIcon />, link: "/admin/ip-tracking" },
    // {
    //   text: "Referral Tree",
    //   icon: <AccountTreeIcon />,
    //   link: "/admin/referral-tree",
    // },
    // {
    //   text: "Top Performance",
    //   icon: <StarIcon />,
    //   link: "/admin/top-performance",
    // },
    // {
    //   text: "Api Transaction",
    //   icon: <ReceiptLongIcon />,
    //   link: "/admin/api-transaction",
    // },
    {
      text: "Deposits",
      icon: <RequestQuoteOutlinedIcon />,
      subItems: rechargeItems,
    },
    {
      text: "Withdrawals",
      icon: <AccountBalanceWalletIcon />,
      subItems: withdrawItems,
    },
    {
      text: "Manage User",
      icon: <PeopleIcon />,
      subItems: memberItems,
    },
    {
      text: "Additional",
      icon: <GiftIcon />,
      subItems: addonItems,
    },
    {
      text: "VIP Level",
      icon: isDemoAdmin ? <LockIcon /> : <Brightness7Icon />,
      link: "/admin/vip-levels",
      disabled: isDemoAdmin,
    },
    {
      text: "Settings",
      icon: <BuildOutlinedIcon />,
      subItems: settingsItems,
      link: "/admin/system-setting",
    },
    // {
    //   text: "Create Salary",
    //   icon: isDemoAdmin ? <LockIcon /> : <SavingsIcon />,
    //   link: "/admin/create-salary",
    // },
    // {
    //   text: "Update Turn Over",
    //   icon: isDemoAdmin ? <LockIcon /> : <ManageHistoryIcon />,
    //   link: "/admin/update-turn-over",
    // },
    // {
    //   text: "Edit Bank Details",
    //   icon: <AssuredWorkloadIcon />,
    //   link: "/admin/edit-bank-detail",
    // },
    // {
    //   text: "Create User",
    //   icon: <SupervisedUserCircleIcon />,
    //   link: "/admin/create-user",
    // },
    // {
    //   text: "Support Ticket",
    //   icon: <HelpIcon />,
    //   link: "/admin/support-system",
    // },
  ];

  const itemSets = {
    ADMIN: allItems,
    FINANCEHEAD: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },
      // {
      //   text: "Illegal Bets",
      //   icon: <ReportProblemIcon />,
      //   link: "/admin/illegal-bets",
      // },
      // {
      //   text: "Profit/Loss",
      //   icon: <MonetizationOnIcon />,
      //   link: "/admin/profit-loss",
      // },
      // {
      //   text: "Api Transaction",
      //   icon: <ReceiptLongIcon />,
      //   link: "/admin/api-transaction",
      // },
      {
        text: "Deposits",
        icon: <RequestQuoteOutlinedIcon />,
        subItems: rechargeItems,
      },
      {
        text: "Withdrawals",
        icon: <AccountBalanceWalletIcon />,
        subItems: withdrawItems,
      },
      {
        text: "Manage User",
        icon: <PeopleIcon />,
        subItems: memberItems,
      },
    ],
    GAMEHEAD: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },
      {
        text: "Manage Games",
        icon: <GamesIcon />,
        subItems: gameManagementItems,
      },
    ],
    SETTINGSHEAD: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },
      {
        text: "VIP Level",
        icon: isDemoAdmin ? <LockIcon /> : <ManageAccountsIcon />,
        link: "/admin/vip-levels",
        disabled: isDemoAdmin,
      },
      {
        text: "Update",
        icon: isDemoAdmin ? <LockIcon /> : <SettingsIcon />,
        link: "/admin/upi-setting",
        disabled: isDemoAdmin,
      },
      // {
      //   text: "Withdrawal Settings",
      //   icon: isDemoAdmin ? <LockIcon /> : <SettingsIcon />,
      //   link: "/admin/withdrawal-setting",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Lucky Streak Setting",
      //   icon: isDemoAdmin ? <LockIcon /> : <SentimentVerySatisfiedIcon />,
      //   link: "/admin/lucky-streak-setting",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Winning Streak Setting",
      //   icon: isDemoAdmin ? <LockIcon /> : <MilitaryTechIcon />,
      //   link: "/admin/winning-streak-setting",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Activity Setting",
      //   icon: isDemoAdmin ? <LockIcon /> : <UpdateIcon />,
      //   link: "/admin/activity-reward",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Lucky Spin",
      //   icon: isDemoAdmin ? <LockIcon /> : <AnimationIcon />,
      //   link: "/admin/lucky-spin",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Attendance Bonus",
      //   icon: isDemoAdmin ? <LockIcon /> : <UpdateIcon />,
      //   link: "/admin/attendance-bonus",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Invitation Bonus",
      //   icon: isDemoAdmin ? <LockIcon /> : <UpdateIcon />,
      //   link: "/admin/invitation-bonus",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "First Deposit Bonus",
      //   icon: isDemoAdmin ? <LockIcon /> : <GiftIcon />,
      //   link: "/admin/first-deposit-setting",
      //   disabled: isDemoAdmin,
      // },
      // {
      //   text: "Other Deposit Bonus",
      //   icon: isDemoAdmin ? <LockIcon /> : <GiftIcon />,
      //   link: "/admin/other-deposit-setting",
      //   disabled: isDemoAdmin,
      // },
    ],
    ADDITIONALHEAD: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },
      {
        text: "Push Notification",
        icon: <NotificationsIcon />,
        link: "/admin/push-notifications",
      },
      {
        text: "Additional",
        icon: <GiftIcon />,
        subItems: addonItems,
      },
      // {
      //   text: "Notifications",
      //   icon: <NotificationsIcon />,
      //   link: "/admin/create-notifications",
      // },
      // {
      //   text: "Create Salary",
      //   icon: isDemoAdmin ? <LockIcon /> : <SavingsIcon />,
      //   link: "/admin/create-salary",
      //   disabled: isDemoAdmin,
      // },
      {
        text: "Create Gift Code",
        icon: <GiftIcon />,
        link: "/admin/create-giftcode",
      },
    ],
    SUPPORTHEAD: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard" },
      { text: "Members", icon: <PeopleIcon />, link: "/admin/active-users" },
      { text: "Support", icon: <HelpIcon />, link: "/admin/support-system" },
      {
        text: "Edit Bank Details",
        icon: <AssuredWorkloadIcon />,
        link: "/admin/edit-bank-detail",
      },
    ],
  };

  return itemSets[accountType] || [];
};

const DrawerItem = React.memo(({ item, currentPath, isActive, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isDemoAdmin, checkDemoAdminRestriction } = useAuth();

  // Check if any sub-item is active to auto-expand parent
  const hasActiveSubItem = item.subItems?.some(subItem => currentPath === subItem.link);

  useEffect(() => {
    if (hasActiveSubItem) {
      setOpen(true);
    }
  }, [hasActiveSubItem]);

  const springProps = useSpring({
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: level * 80,
    config: { tension: 300, friction: 25 },
  });

  const handleClick = () => {
    if (item.disabled && isDemoAdmin) {
      checkDemoAdminRestriction(`access ${item.text}`);
      return;
    }

    if (item.subItems) {
      setOpen(!open);
    }
  };

  const indentPadding = {
    xs: level * 1.5,
    sm: level * 2,
  };

  if (item.subItems) {
    return (
      <animated.div style={springProps}>
        <StyledListItem
          button
          onClick={handleClick}
          active={0}
          disabled={item.disabled}
          sx={{ pl: 2 + indentPadding }}
        >
          <ListItemIcon>
            <animated.div style={springProps}>{item.icon}</animated.div>
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              "& .MuiTypography-root": {
                transition: "font-weight 0.2s ease",
              },
            }}
          />
          <animated.div style={springProps}>
            {open ? (
              <ExpandLessIcon
                sx={{
                  color: themeColors.text.secondary,
                  transition: "all 0.3s ease",
                }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{
                  color: themeColors.text.secondary,
                  transition: "all 0.3s ease",
                }}
              />
            )}
          </animated.div>
        </StyledListItem>
        <Collapse in={open} timeout={400} unmountOnExit>
          <List component="div" disablePadding>
            {item.subItems.map((subItem, index) => (
              <DrawerItem
                key={`${subItem.text}-${index}`}
                item={subItem}
                currentPath={currentPath}
                isActive={currentPath === subItem.link}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      </animated.div>
    );
  }

  return (
    <animated.div style={springProps}>
      <StyledListItem
        button
        component={item.disabled ? "div" : Link}
        to={item.disabled ? undefined : item.link}
        onClick={item.disabled ? handleClick : undefined}
        active={isActive ? 1 : 0}
        disabled={item.disabled}
        sx={{
          pl: 2 + indentPadding,
          position: "relative",
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
        {item.disabled && isDemoAdmin && (
          <Chip
            label="LOCKED"
            size="small"
            sx={{
              height: "22px",
              fontSize: "0.65rem",
              background: themeColors.gradient.secondary,
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          />
        )}
      </StyledListItem>
    </animated.div>
  );
});

const DrawerContent = React.memo(({ items, currentPath }) => (
  <List sx={{ padding: 0 }}>
    {items.map((item, index) => (
      <DrawerItem
        key={`${item.text}-${index}`}
        item={item}
        currentPath={currentPath}
        isActive={currentPath === item.link}
      />
    ))}
  </List>
));

const ProfileMenu = React.memo(({ anchorEl, handleClose, handleLogout }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: "scale(0.9) translateY(-10px)" },
    to: { opacity: 1, transform: "scale(1) translateY(0)" },
    config: { tension: 300, friction: 22 },
  });

  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          backgroundColor: themeColors.background.paper,
          backdropFilter: "blur(24px)",
          border: `1px solid ${themeColors.border.light}`,
          borderRadius: "16px",
          minWidth: "220px",
          overflow: "visible",
          filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.4))",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 12,
            height: 12,
            bgcolor: themeColors.background.paper,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
            borderLeft: `1px solid ${themeColors.border.light}`,
            borderTop: `1px solid ${themeColors.border.light}`,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <animated.div style={springProps}>
        <MenuItem
          onClick={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.5,
            px: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              background: themeColors.gradient.primary,
              color: "#ffffff",
              "& .MuiListItemIcon-root": {
                color: "#ffffff",
              },
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: themeColors.text.primary, fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{
              sx: {
                color: themeColors.text.primary,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.9375rem",
              },
            }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: themeColors.border.light, my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.5,
            px: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              background: themeColors.gradient.secondary,
              color: "#ffffff",
              "& .MuiListItemIcon-root": {
                color: "#ffffff",
              },
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: themeColors.demo.error, fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary="Log Out"
            primaryTypographyProps={{
              sx: {
                color: themeColors.text.primary,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.9375rem",
              },
            }}
          />
        </MenuItem>
      </animated.div>
    </Menu>
  );
});

const AdminPanel = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { accountType } = useContext(UserContext);
  const { logout, isDemoAdmin } = useAuth();
  const navigate = useNavigate();

  // Set initial drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  // Close drawer on location change for non-large screens
  useEffect(() => {
    if (!isLargeScreen) {
      setDrawerOpen(false);
    }
    setLoadingProgress(100);
  }, [location, isLargeScreen]);

  const handleDrawerToggle = () => {
    if (!isLargeScreen) {
      setDrawerOpen(!drawerOpen);
    }
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleGoHome = () => {
    navigate("/");
    if (isMobile) setDrawerOpen(false);
  };

  const handleGoSetting = () => {
    if (isDemoAdmin) {
      checkDemoAdminRestriction("access system settings");
      return;
    }
    navigate("/admin/system-setting");
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Reset scroll position when location changes
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto"; // Ensure body can scroll

    // Set timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      setLoadingProgress(100);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  const drawerItems = useMemo(
    () => getDrawerItems(accountType, isDemoAdmin),
    [accountType, isDemoAdmin]
  );

  const drawer = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Toolbar sx={{ px: 2.5, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >

            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#ffffff",
                letterSpacing: "1px",
                width: "100%",
                textAlign: "center",
              }}
            >
              ADMIN PANEL
            </Typography>
          </Box>

        </Toolbar>
        <Divider sx={{ borderColor: themeColors.border.light }} />
        <ScrollContainer>
          <Box sx={{ py: 2 }}>
            <DrawerContent
              items={drawerItems}
              currentPath={location.pathname}
            />
          </Box>
        </ScrollContainer>
        <Divider sx={{ borderColor: themeColors.border.light }} />
        <Box sx={{ p: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: themeColors.text.secondary,
              fontFamily: "'Inter', sans-serif",
              display: "block",
              textAlign: "center",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            © 2025 Admin Panel Pro
          </Typography>
        </Box>
      </Box>
    ),
    [drawerItems, location.pathname, logoUrl]
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden",
        bgcolor: themeColors.background.default,
      }}
    >
      <CssBaseline />

      <StyledAppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            lg: drawerOpen ? `calc(100% - ${drawerWidth.lg}px)` : "100%",
          },
          ml: {
            xs: 0,
            lg: drawerOpen ? `${drawerWidth.lg}px` : 0,
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, sm: 72 },
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, sm: 4 },
            gap: 2,
          }}
        >
          {/* Left side - Logo and Menu Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: "1 1 auto",
            }}
          >
            {!isLargeScreen && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  "&:hover": {
                    background: themeColors.gradient.primary,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* Demo Admin Badge */}
              {isDemoAdmin && (
                <Chip
                  label="🎭 DEMO MODE"
                  size="small"
                  sx={{
                    background: themeColors.gradient.secondary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.5px",
                    height: "32px",
                    px: 1,
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.8, transform: "scale(0.98)" },
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Right side - Action Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              ml: "auto",
            }}
          >
            <Tooltip title="Go to Website" arrow>
              <IconButton
                onClick={handleGoHome}
                size="medium"
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  "&:hover": {
                    background: themeColors.gradient.success,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <PublicIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="System Settings" arrow>
              <IconButton
                onClick={handleGoSetting}
                size="medium"
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  "&:hover": {
                    background: themeColors.gradient.primary,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <BuildOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications" arrow>
              <IconButton
                size="medium"
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  "&:hover": {
                    background: themeColors.gradient.primary,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <AnimatedBadge
                  badgeContent={4}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 6px",
                      fontFamily: "'Inter', sans-serif",
                      background: themeColors.gradient.secondary,
                      fontWeight: 700,
                    },
                  }}
                >
                  <NotificationsIcon />
                </AnimatedBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account" arrow>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="medium"
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  "&:hover": {
                    background: themeColors.gradient.primary,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        <LinearProgress
          variant="determinate"
          value={loadingProgress}
          sx={{
            height: "3px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            "& .MuiLinearProgress-bar": {
              background: themeColors.gradient.primary,
            },
          }}
        />
      </StyledAppBar>

      <StyledDrawer
        variant={isLargeScreen ? "permanent" : "temporary"}
        open={isLargeScreen ? true : drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: {
              xs: drawerWidth.xs,
              sm: drawerWidth.sm,
              md: drawerWidth.md,
              lg: drawerWidth.lg,
            },
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            lg: drawerOpen ? `calc(100% - ${drawerWidth.lg}px)` : "100%",
          },
          minHeight: "100vh",
          height: "100%",
          pt: { xs: "64px", sm: "72px" },
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <Box
          sx={{
            borderRadius: 3,
            backgroundColor: themeColors.background.paper,
            p: { xs: 2.5, sm: 4 },
            m: { xs: 2, sm: 3 },
            flexGrow: 1,
            overflow: "auto",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
            border: `1px solid ${themeColors.border.light}`,
            "& > *": {
              mb: 3,
              "&:last-child": {
                mb: 0,
              },
            },
          }}
        > */}
        {children}
        {/* </Box> */}
      </Box>

      <ProfileMenu
        anchorEl={anchorEl}
        handleClose={handleProfileMenuClose}
        handleLogout={handleLogout}
      />
    </Box>
  );
};

export default React.memo(AdminPanel);