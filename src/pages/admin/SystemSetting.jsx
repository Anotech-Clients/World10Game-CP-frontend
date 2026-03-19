import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Tabs, Tab, AppBar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import CasinoIcon from "@mui/icons-material/Casino";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaymentsIcon from "@mui/icons-material/Payments";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import BlockIcon from "@mui/icons-material/Block";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Filter5Icon from "@mui/icons-material/Filter5";
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import CategoryIcon from "@mui/icons-material/Category";

// Settings data
const settingsData = [
  {
    icon: SettingsIcon,
    title: "Payment Setup",
    description: "Set up how money comes into your system. Add payment methods like UPI, set commission rates for agents, and decide bonus percentages for deposits.",
    link: "/admin/upi-setting",
    color: "#4CAF50"
  },
  // {
  //   icon: AccountBalanceIcon,
  //   title: "Withdrawal Rules",
  //   description: "Control how much money users can take out at once. Set the smallest amount (minimum) and largest amount (maximum) that users are allowed to withdraw.",
  //   link: "/admin/withdrawal-setting",
  //   color: "#2196F3"
  // },
  // {
  //   icon: RequestQuoteIcon,
  //   title: "First Deposit Bonus",
  //   description: "Create special rewards for new users when they add money for the first time. This helps attract new customers by giving them extra bonus money or benefits.",
  //   link: "/admin/first-deposit-setting",
  //   color: "#F44336"
  // },
  // {
  //   icon: CreditCardIcon,
  //   title: "Other Deposit Bonus",
  //   description: "Create special rewards for new users when they add money for the seccond or third time. This helps attract new customers by giving them extra bonus money or benefits.",
  //   link: "/admin/other-deposit-setting",
  //   color: "#FF9800"
  // },
  // {
  //   icon: CalendarTodayIcon,
  //   title: "Activity Rewards",
  //   description: "Create rewards for different actions users take in the app. Give points, bonuses, or special items when users complete certain activities or tasks.",
  //   link: "/admin/activity-reward",
  //   color: "#9C27B0"
  // },
  // {
  //   icon: PeopleIcon,
  //   title: "Invitation Rewards",
  //   description: "Set up bonuses for users who bring their friends to the app. When someone invites a new person who joins, both can receive special rewards.",
  //   link: "/admin/invitation-bonus",
  //   color: "#00BCD4"
  // },
  // {
  //   icon: CheckCircleIcon,
  //   title: "Attendance Bonus",
  //   description: "Set up daily login rewards where users must deposit a specific amount to be eligible. You can also customize the bonus amount they receive upon successful check-in.",
  //   link: "/admin/attendance-bonus",
  //   color: "#009688"
  // },
  // {
  //   icon: EmojiEventsIcon,
  //   title: "Lucky Streak Rewards",
  //   description: "Set up rewards for users who recharge frequently in each month. You can customize both the required recharge amount and the reward amount.",
  //   link: "/admin/lucky-streak-setting",
  //   color: "#FFC107"
  // },
  // {
  //   icon: MilitaryTechIcon,
  //   title: "Winning Streak Bonus",
  //   description: "Create special rewards for users who win multiple games in a row. This encourages continued play and rewards skillful players with extra bonuses.",
  //   link: "/admin/winning-streak-setting",
  //   color: "#673AB7"
  // },
  // {
  //   icon: CasinoIcon,
  //   title: "Lucky Spin Wheel",
  //   description: "Set up the prizes and chances on the spinning wheel game. You control what rewards users can win when they spin the wheel and how often they can spin.",
  //   link: "/admin/lucky-spin",
  //   color: "#E91E63"
  // },
];

// Dashboard data
const dashboardData = [
  {
    icon: DashboardIcon,
    title: "Overview Dashboard",
    description: "View key performance metrics, user statistics, and financial data in real-time. Get a complete overview of your platform's performance.",
    link: "/admin/dashboard",
    color: "#3F51B5"
  }
];

// Manage Games data
const manageGames = [
  {
    icon: LooksOneIcon,
    title: "Wingo Admin",
    description: "Manage all aspects of the Wingo game including odds, winnings, game periods, and user betting history. Monitor game performance and adjust settings.",
    link: "/admin/wingo-admin",
    color: "#FF5722"
  },
  {
    icon: LooksTwoIcon,
    title: "K3 Admin",
    description: "Control K3 game parameters, view betting statistics, manage results, and configure game rules. Track player performance and adjust payout percentages.",
    link: "/admin/k3-admin",
    color: "#795548"
  },
  {
    icon: Filter5Icon,
    title: "5D Admin",
    description: "Administer the 5D lottery game including drawing schedule, result verification, and payout management. Configure game rules and monitor betting patterns.",
    link: "/admin/fived-admin",
    color: "#9C27B0"
  },
  // {
  //   icon: DirectionsCarIcon,
  //   title: "Car Race Admin",
  //   description: "Manage the Car Race game settings including race intervals, odds adjustment, and winner determination. Monitor betting amounts and race statistics.",
  //   link: "/admin/car-race-admin",
  //   color: "#FFC107"
  // },
];

// Deposits data
const deposits = [
  {
    icon: MoneyOffIcon,
    title: "Pending Deposit",
    description: "Review and process pending deposit requests from users. Verify transaction details and approve deposits to user accounts.",
    link: "/admin/pending-deposit",
    color: "#FF9800"
  },
  {
    icon: PaymentsIcon,
    title: "Approved Deposit",
    description: "View history of all approved deposits with detailed transaction information. Generate reports and track deposit trends over time.",
    link: "/admin/all-deposit",
    color: "#4CAF50"
  },
];

// Withdrawals data
const withdrawals = [
  {
    icon: MoneyOffIcon,
    title: "Pending Withdraw",
    description: "Process pending withdrawal requests from users. Verify user identity, check for any suspicious activity, and approve legitimate withdrawal requests.",
    link: "/admin/pending-withdraw",
    color: "#F44336"
  },
  {
    icon: LocalAtmIcon,
    title: "Approved Withdraw",
    description: "Review all completed withdrawals with full transaction details. Monitor withdrawal patterns and generate financial reports for accounting.",
    link: "/admin/all-withdraw",
    color: "#2196F3"
  },
];

// Manage Users data
const manageUser = [
  {
    icon: GroupIcon,
    title: "Active User",
    description: "View and manage all active user accounts on the platform. Monitor user activity, balance information, and account details.",
    link: "/admin/active-users",
    color: "#009688"
  },
  // {
  //   icon: BlockIcon,
  //   title: "Banned User",
  //   description: "Review banned user accounts and their violation history. Manage ban durations and requirements for account reinstatement.",
  //   link: "/admin/banned-users",
  //   color: "#E91E63"
  // },
];

// Additional features data
const additional = [
  {
    icon: CardGiftcardIcon,
    title: "Create Giftcode",
    description: "Generate and manage promotional gift codes for users. Set code values, expiration dates, and usage limitations for marketing campaigns.",
    link: "/admin/create-giftcode",
    color: "#673AB7"
  },
  // {
  //   icon: NotificationsIcon,
  //   title: "Notifications",
  //   description: "Create system-wide notifications for all users or targeted messages for specific user groups. Schedule announcements and promotional alerts.",
  //   link: "/admin/create-notifications",
  //   color: "#00BCD4"
  // },
];

// Others data
const others = [
  // {
  //   icon: ReceiptLongIcon,
  //   title: "Illegal Bets",
  //   description: "Monitor and investigate suspicious betting patterns. Identify and review bets that violate platform rules or show signs of fraudulent activity.",
  //   link: "/admin/illegal-bets",
  //   color: "#673AB7"
  // },
  // {
  //   icon: AccountBalanceIcon,
  //   title: "Profit/Loss",
  //   description: "Track financial performance with detailed profit and loss reports. Analyze revenue streams and expenses across different time periods.",
  //   link: "/admin/profit-loss",
  //   color: "#00BCD4"
  // },
  // {
  //   icon: PeopleIcon,
  //   title: "Agent Performance",
  //   description: "Evaluate agent effectiveness and productivity metrics. Track referrals, commissions earned, and overall contribution to platform growth.",
  //   link: "/admin/agent-performance",
  //   color: "#4CAF50"
  // },
  // {
  //   icon: TrackChangesIcon,
  //   title: "IP Records",
  //   description: "Monitor user login locations and access patterns. Identify suspicious activities and potential security concerns through IP tracking.",
  //   link: "/admin/ip-tracking",
  //   color: "#F44336"
  // },
  // {
  //   icon: GroupIcon,
  //   title: "Referral Tree",
  //   description: "Visualize the hierarchical structure of user referrals. Track multi-level marketing relationships and affiliate performance.",
  //   link: "/admin/referral-tree",
  //   color: "#2196F3"
  // },
  // {
  //   icon: EmojiEventsIcon,
  //   title: "Top Performance",
  //   description: "Identify top-performing users, games, and promotions. Analyze success patterns and influential factors in platform growth.",
  //   link: "/admin/top-performance",
  //   color: "#FF9800"
  // },
  // {
  //   icon: RequestQuoteIcon,
  //   title: "Api Transaction",
  //   description: "Monitor third-party API integrations and transactions. Track API call volumes, success rates, and data exchange history.",
  //   link: "/admin/api-transaction",
  //   color: "#9C27B0"
  // },
  {
    icon: MilitaryTechIcon,
    title: "VIP Level",
    description: "Configure and manage VIP tier systems and rewards. Set qualification criteria, benefits, and special privileges for different user levels.",
    link: "/admin/vip-levels",
    color: "#E91E63"
  },
  // {
  //   icon: PaymentsIcon,
  //   title: "Create Salary",
  //   description: "Set up and manage staff compensation programs. Define salary structures, commission rates, and payment schedules for team members.",
  //   link: "/admin/create-salary",
  //   color: "#009688"
  // },
  // {
  //   icon: CasinoIcon,
  //   title: "Update Turn Over",
  //   description: "Manage user betting requirements and turnover obligations. Track and update wagering conditions for bonuses and promotional offers.",
  //   link: "/admin/update-turn-over",
  //   color: "#FFC107"
  // },
  // {
  //   icon: AccountBalanceIcon,
  //   title: "Edit Bank Details",
  //   description: "Update and manage platform banking information. Maintain accurate payment processing details for deposits and withdrawals.",
  //   link: "/admin/edit-bank-detail",
  //   color: "#795548"
  // },
  // {
  //   icon: GroupIcon,
  //   title: "Create User",
  //   description: "Add new user accounts with custom configurations. Set initial permissions, balances, and account restrictions for platform users.",
  //   link: "/admin/create-user",
  //   color: "#3F51B5"
  // },
  // {
  //   icon: SupportAgentIcon,
  //   title: "Support Ticket",
  //   description: "Manage customer service requests and inquiries. Track ticket status, assign support agents, and monitor resolution progress.",
  //   link: "/admin/support-system",
  //   color: "#4CAF50"
  // },
];

const DashboardCard = ({ icon: Icon, title, description, link, color }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        minHeight: "180px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        transition: "all 0.4s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 12px 40px ${color}44`,
          borderColor: color,
        },
        cursor: "pointer",
        backgroundColor: "#1e293b",
        border: "1px solid rgba(148, 163, 184, 0.12)",
      }}
      onClick={() => navigate(link)}
    >
      {/* Decorative gradient elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: `radial-gradient(circle at top right, ${color}22, transparent 70%)`,
          borderRadius: "0 0 0 100%",
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "80px",
          height: "80px",
          background: `radial-gradient(circle at bottom left, ${color}18, transparent 70%)`,
          borderRadius: "0 100% 0 0",
          zIndex: 0
        }}
      />

      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "14px",
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 20px ${color}66`,
              mr: 2.5,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "rotate(8deg) scale(1.05)",
              }
            }}
          >
            <Icon sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#f8fafc",
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.6,
            color: "#94a3b8",
            fontSize: "0.95rem",
            fontWeight: 400,
            pl: 0.5,
            borderLeft: `3px solid ${color}`,
            paddingLeft: 2,
            marginLeft: 1,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {description}
        </Typography>

        {/* Visual indicator for clickable action */}
        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          opacity: 0.7
        }}>
          <Typography sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: color,
            display: "flex",
            alignItems: "center",
            fontFamily: 'Inter, sans-serif',
          }}>
            CLICK TO MANAGE
            <Box
              component="span"
              sx={{
                ml: 1,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "white"
              }}
            >
              →
            </Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Define tab icons and labels
  const tabs = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
    { label: "Games", icon: <SportsEsportsIcon /> },
    { label: "Deposits", icon: <CreditCardIcon /> },
    { label: "Withdrawals", icon: <AccountBalanceIcon /> },
    { label: "Users", icon: <GroupIcon /> },
    { label: "Additional", icon: <BuildCircleOutlinedIcon /> },
    { label: "Others", icon: <CategoryIcon /> },
  ];

  // Get active tab data
  const getTabData = () => {
    switch (currentTab) {
      case 0:
        return { title: "Dashboard Overview", icon: DashboardIcon, data: dashboardData };
      case 1:
        return { title: "System Settings", icon: SettingsIcon, data: settingsData };
      case 2:
        return { title: "Game Management", icon: SportsEsportsIcon, data: manageGames };
      case 3:
        return { title: "Deposit Management", icon: CreditCardIcon, data: deposits };
      case 4:
        return { title: "Withdrawal Management", icon: AccountBalanceIcon, data: withdrawals };
      case 5:
        return { title: "User Management", icon: GroupIcon, data: manageUser };
      case 6:
        return { title: "Additional Features", icon: BuildCircleOutlinedIcon, data: additional };
      case 7:
        return { title: "Other Administration Tools", icon: CategoryIcon, data: others };
      default:
        return { title: "Dashboard Overview", icon: DashboardIcon, data: dashboardData };
    }
  };

  const activeTabData = getTabData();

  return (
    <Box sx={{ bgcolor: "#0f172a", minHeight: "100vh", fontFamily: 'Inter, sans-serif' }}>
      {/* Tabs for navigation */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1e293b",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)"
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 600,
              color: "#94a3b8",
              fontFamily: 'Inter, sans-serif',
              '&.Mui-selected': {
                color: "#6366f1"
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: "3px 3px 0 0",
              backgroundColor: "#6366f1"
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                '& .MuiSvgIcon-root': {
                  mr: 1,
                  fontSize: '1.25rem'
                }
              }}
            />
          ))}
        </Tabs>
      </AppBar>

      {/* Content area */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Tab content */}
        <Grid container spacing={3.5}>
          {activeTabData.data.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <DashboardCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                link={item.link}
                color={item.color}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;