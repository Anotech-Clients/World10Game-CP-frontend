import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserState from "./context/UserState";

import ProtectedRoute from "./components/utils/ProtectedRoutes/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";
import Home from "./pages/Home";
import LoadingPage from "./pages/loadingPage/LoadingPage";
import AdminRoute from "./components/utils/ProtectedRoutes/AdminRoute";
import AgentRoute from "./components/utils/ProtectedRoutes/AgentRoute.jsx";
import { ResponsiveRacingWrapper } from "./components/games/carRace/RacingAnimation.jsx";
import { GameProvider } from "./context/GameContext.jsx";
import { BannerPosterProvider } from "./context/BannerPosterContext.jsx";

const Activity = lazy(() => import("./pages/Activity"));
const Promotion = lazy(() => import("./pages/Promotion"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Account = lazy(() => import("./pages/Account"));
const GiftCoupon = lazy(() => import("./pages/activityPages/GiftCoupon"));
const Attendance = lazy(() => import("./pages/activityPages/attendance/Attendance"));
const CollectionRecord = lazy(() => import("./pages/activityPages/CollectionRecord"));

// import ActivityReward from "./pages/activityPages/ActivityReward";
// import InvitationBonus from "./pages/activityPages/InvitationBonus";
// import WinningStreak from "./pages/activityPages/WinningStreak";
// import Lucky10days from "./pages/activityPages/Lucky10Days";

const SubordinateData = lazy(() => import("./pages/promotionPages/SubordinateData"));
const FirstDepositBonus = lazy(() => import("./pages/activityPages/FirstDepositBonus"));
const ActivityDetails = lazy(() => import("./pages/activityPages/ActivityDetails"));
const CommissionDetail = lazy(() => import("./pages/promotionPages/CommissionDetail"));
const LotteryCommission = lazy(() => import("./pages/promotionPages/LotteryCommission"));
const InvitationRule = lazy(() => import("./pages/promotionPages/InvitationRule"));
const NewSubordinate = lazy(() => import("./pages/promotionPages/NewSubordinate"));
const CustomerService = lazy(() => import("./pages/accountPages/CustomerService"));
const ChatZone = lazy(() => import("./pages/accountPages/ChatZone"));
const Support = lazy(() => import("./pages/accountPages/Support"));
const Notification = lazy(() => import("./pages/accountPages/Notification"));
const Feedback = lazy(() => import("./pages/accountPages/Feedback"));
const GameStatistic = lazy(() => import("./pages/accountPages/GameStatistics"));
const Language = lazy(() => import("./pages/accountPages/Language"));
const PasswordChange = lazy(() => import("./components/account/passwordChange"));
const Deposit = lazy(() => import("./pages/walletPages/Deposit"));
const USDTDepositPage = lazy(() => import("./pages/walletPages/UsdtDepositPage"));
const WithDraw = lazy(() => import("./pages/walletPages/Withdraw"));
const WingoPage = lazy(() => import("./pages/games/WingoPage"));
const FiveDPage = lazy(() => import("./pages/games/FiveDPage"));
const K3Page = lazy(() => import("./pages/games/K3Page"));
const TransactionHistory = lazy(() => import("./pages/accountPages/TransactionHistory"));
const BetHistory = lazy(() => import("./pages/accountPages/BetHistory"));
const DepositHistory = lazy(() => import("./pages/walletPages/DepositHistory"));
const WithdrawHistory = lazy(() => import("./pages/walletPages/WithdrawHistory"));
const Setting = lazy(() => import("./pages/accountPages/Setting"));
const SuperJackpot = lazy(() => import("./pages/activityPages/SuperJackpot"));
const Rule = lazy(() => import("./pages/activityPages/Rule"));
const WinningStreakRule = lazy(() => import("./components/activity/WinningStreakRule.jsx"));
const Lucky10DaysRule = lazy(() => import("./components/activity/Lucky10DaysRule.jsx"));
const WinningStar = lazy(() => import("./pages/activityPages/WinningStar"));
const GiftPackage = lazy(() => import("./pages/activityPages/GiftPackage"));
const BettingRebate = lazy(() => import("./pages/activityPages/BettingRebate"));
const AllRebateHistory = lazy(() => import("./pages/activityPages/AllRebateHistory"));
const VipPage = lazy(() => import("./pages/accountPages/VipPage"));
const AvatarChange = lazy(() => import("./pages/accountPages/AvatarChange"));
const Message = lazy(() => import("./pages/accountPages/Message"));
const AboutUs = lazy(() => import("./pages/accountPages/AboutUs"));
const EventDesc = lazy(() => import("./components/games/LuckySpin/EventDescription"));
const EventDetails = lazy(() => import("./components/games/LuckySpin/EventDetails"));
const ActivityRules = lazy(() => import("./components/games/LuckySpin/ActivityRules"));
const InviteLink = lazy(() => import("./pages/promotionPages/InviteLink"));
const AddBank = lazy(() => import("./pages/walletPages/AddBank"));
const UsdtAddress = lazy(() => import("./pages/walletPages/UsdtAddress"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));

import LuckySpin from "./pages/games/LuckySpin";
import TournamentManagement from "./pages/admin/TournamentManagement";
import DynamicSpinEventAdmin from "./pages/admin/DynamicSpinEventSimpleAdmin";
import DynamicSpinEvent from "./pages/DynamicSpinEvent";
import DynamicSpinEventHistory from "./pages/DynamicSpinEventHistory";
import Tournament from "./pages/Tournament";
import CreateNotifications from "./pages/admin/additional/CreateNotifications";
import WithdrawalLimitSetting from "./pages/admin/setting/WithdrawalLimitSetting";
import ActivityRewardSetting from "./pages/admin/setting/ActivityRewardSetting";
import InvitationBonusSetting from "./pages/admin/setting/InvitationBonusSetting";
import BannedUsers from "./pages/admin/manageUsers/BannedUsers";

const AllDeposit = lazy(() => import("./pages/admin/deposit/AllDeposit"));
const PendingWithdraws = lazy(() => import("./pages/admin/withdraw/PendingWithdraws"));
const PendingDepositRequest = lazy(() => import("./pages/admin/deposit/PendingDepositRequest"));
const AllWithdraws = lazy(() => import("./pages/admin/withdraw/AllWithdraws"));
const CreateGift = lazy(() => import("./pages/admin/additional/CreateGift"));
const UpiComissionSetting = lazy(() => import("./pages/admin/setting/UpiComissionSetting"));
const FirstDepositBonusSetting = lazy(() => import("./pages/admin/setting/FirstDepositBonusSetting"));
const ActiveUsers = lazy(() => import("./pages/admin/manageUsers/ActiveUsers"));
const UserDetails = lazy(() => import("./pages/admin/manageUsers/UserDetails"));
const WingoGameMonitor = lazy(() => import("./pages/admin/manageGames/wingo/WingoGameMonitor.jsx"));
const K3GameMonitor = lazy(() => import("./pages/admin/manageGames/k3/K3GameMonitor.jsx"));
const FiveDGameMonitor = lazy(() => import("./pages/admin/manageGames/fived/FiveDGameMonitor.jsx"));
const OtherDepositSetting = lazy(() => import("./pages/admin/setting/OtherDepositSetting.jsx"));
const VIP = lazy(() => import("./pages/admin/VIP.jsx"));
const RefferalTree = lazy(() => import("./pages/admin/RefferalTree.jsx"));
const RefundProcess = lazy(() => import("./pages/customerServicePages/refundPoilicy.jsx"));
const SystemSetting = lazy(() => import("./pages/admin/SystemSetting.jsx"));

import CarRaceGameMonitor from "./pages/admin/manageGames/carrace/CarRaceGameMonitor.jsx";
import IllegalBetMonitor from "./pages/admin/IllegalBetMonitor.jsx";
import AttendanceBonusSetting from "./pages/admin/setting/AttendanceBonusSetting";
import LuckyStreakSetting from "./pages/admin/setting/LuckyStreakSetting.jsx";
import LuckySpinSetting from "./pages/admin/setting/LuckySpinSetting.jsx";
import WinningStreakSetting from "./pages/admin/setting/WinningStreakSetting.jsx";
import ProfitAndLoss from "./pages/admin/ProfitAndLoss.jsx";
import AgentPerformance from "./pages/admin/AgentPerformance.jsx";
import IPInformation from "./pages/admin/IPInformation.jsx";
import CreateUser from "./pages/admin/CreateUser.jsx";
import TopPerformance from "./pages/admin/TopPerformance.jsx";
import SupportTicketSystem from "./pages/admin/SupportTicketSystem.jsx";
import CreateSalary from "./pages/admin/createSalary.jsx";
import UpdateTurnOver from "./pages/admin/UpdateTurnOver.jsx";
import EditBankDetails from "./pages/admin/manageUsers/EditBankDetails.jsx";

const InvitationRewardRules = lazy(() => import("./pages/activityPages/InvitationRewardRules.jsx"));
const InvitationRecord = lazy(() => import("./pages/activityPages/InvitationRecord.jsx"));
const GameRules = lazy(() => import("./components/activity/GameRules.jsx"));
const AttendanceHistory = lazy(() => import("./components/activity/AttendanceHistory.jsx"));
const TMSChangePassword = lazy(() => import("./pages/customerServicePages/TMSChangePassword.jsx"));
const ChangeIFSC = lazy(() => import("./pages/customerServicePages/ChangeIFSC.jsx"));
const ChangeBankName = lazy(() => import("./pages/customerServicePages/ChangeBankName.jsx"));
const ProgressQueries = lazy(() => import("./pages/customerServicePages/ProgressQueries.jsx"));
const AddUSDT = lazy(() => import("./pages/customerServicePages/AddUSDT.jsx"));
const ModifyBankDetails = lazy(() => import("./pages/customerServicePages/ModifyBankDetails.jsx"));
const ActivityBonus = lazy(() => import("./pages/customerServicePages/ActivityBonus.jsx"));
const GameProblem = lazy(() => import("./pages/customerServicePages/GameProblem.jsx"));
const Others = lazy(() => import("./pages/customerServicePages/Others.jsx"));
const DepositRechargeHistory = lazy(() => import("./pages/customerServicePages/DepositRechargeHistory.jsx"));
const DepositIssue = lazy(() => import("./pages/customerServicePages/DepositIssue.jsx"));
const WithdrawalHistory = lazy(() => import("./pages/customerServicePages/WithdrawalHistory.jsx"));
const WithdrawalIssue = lazy(() => import("./pages/customerServicePages/WithdrawalIssue.jsx"));
const BettingRecord = lazy(() => import("./components/games/common/BettingRecord.jsx"));
const CarRacingPage = lazy(() => import("./pages/games/CarRacingPage.jsx"));
const AllGamesPage = lazy(() => import("./pages/games/AllGamesPage.jsx"));
const ApiTransaction = lazy(() => import("./pages/admin/ApiTransaction.jsx"));
const PvcAllGames = lazy(() => import("./pages/games/PvcAllGames.jsx"));
const SlotsAllGames = lazy(() => import("./pages/games/SlotsAllGames.jsx"));
const CustomerTelegram = lazy(() => import("./pages/accountPages/CustomerTelegram.jsx"));
const AgentPerformanceDashboard = lazy(() => import("./pages/agentPerformancePages/AgentPerformanceDashboard.jsx"));
const PushNotificationAdmin = lazy(() => import("./pages/admin/PushNotificationAdmin.jsx"));
const UPIManualDepositPage = lazy(() => import("./pages/walletPages/UPIManualDepositPage.jsx"));
const UPIManagement = lazy(() => import("./pages/walletPages/UPIManagement.jsx"));

import BannerPosterUpdate from "./pages/admin/BannerPosterUpdate.jsx";
import UPIManagementAdmin from "./pages/admin/UPIManagementAdmin.jsx";

function App() {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/racing-animation"
                element={<ResponsiveRacingWrapper />}
              />
            </Routes>
            <UserState>
              <GameProvider>
                <BannerPosterProvider>
                  <AppContent />
                </BannerPosterProvider>
              </GameProvider>
            </UserState>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return <LoadingPage />;
  }

  return (
    <>
      <Routes>
        <Route path="/register/*" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<LoadingPage />} /> */}
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/customer-telegram" element={<CustomerTelegram />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tms/change-password" element={<TMSChangePassword />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/tournament" element={<Tournament />} /> */}
          {/* <Route path="/dynamic-spin-event" element={<DynamicSpinEvent />} />
          <Route path="/dynamic-spin-event/history" element={<DynamicSpinEventHistory />} /> */}
          <Route path="/all-games/:id" element={<AllGamesPage />} />
          <Route path="/pvc/allgames" element={<PvcAllGames />} />
          <Route path="/all-slots/:id" element={<SlotsAllGames />} />

          {/* Activity Pages */}


          <Route path="/gift-coupon" element={<GiftCoupon />} />
          <Route path="/attendance" element={<Attendance />} />
          {/* <Route
            path="/activity/activity-reward"
            element={<ActivityReward />}
          /> */}
          <Route
            path="/activity/activity-reward/collection-record"
            element={<CollectionRecord />}
          />
          {/* <Route
            path="/activity/invitation-bonus"
            element={<InvitationBonus />}
          /> */}
          {/* <Route path="/activity/winning-streak" element={<WinningStreak />} />
          <Route path="/activity/lucky-10days" element={<Lucky10days />} /> */}
          <Route
            path="/activity/first-deposit-bonus"
            element={<FirstDepositBonus />}
          />
          <Route
            path="/activity/activity-details/:id"
            element={<ActivityDetails />}
          />
          <Route path="/activity/super-jackpot" element={<SuperJackpot />} />
          <Route path="/activity/super-jackpot/rule" element={<Rule />} />
          <Route
            path="/activity/winning-streak/rule"
            element={<WinningStreakRule />}
          />
          <Route
            path="/activity/lucky-10days/rule"
            element={<Lucky10DaysRule />}
          />
          <Route
            path="/activity/super-jackpot/winning-star"
            element={<WinningStar />}
          />
          <Route path="/activity/gift-package" element={<GiftPackage />} />
          <Route path="/activity/betting-rebate" element={<BettingRebate />} />
          <Route
            path="/activity/betting-rebate-History"
            element={<AllRebateHistory />}
          />
          <Route
            path="/activity/invitation-reward-rules"
            element={<InvitationRewardRules />}
          />
          <Route
            path="/activity/invitation-record"
            element={<InvitationRecord />}
          />
          <Route path="/activity/games-rule" element={<GameRules />} />
          <Route
            path="/activity/attendance/history"
            element={<AttendanceHistory />}
          />

          {/* Lottery Games Routes */}
          <Route path="/home/AllLotteryGames">
            {/* Wingo Routes */}
            <Route path="wingo">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            {/* K3 Routes */}
            <Route path="k3">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            <Route path="5d">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            <Route path="car-race">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            {/* Dynamic route for any game's betting records */}
            <Route
              path=":gameType/BettingRecordWin"
              element={<BettingRecord />}
            />
          </Route>

          {/* Promotion Pages */}

          <Route
            path="/promotion/subordinate-data"
            element={<SubordinateData />}
          />
          <Route
            path="/promotion/commission-detail"
            element={<CommissionDetail />}
          />
          <Route
            path="/promotion/commission-detail/lottery-commission"
            element={<LotteryCommission />}
          />
          <Route
            path="/promotion/invitation-rule"
            element={<InvitationRule />}
          />
          <Route
            path="/promotion/new-subordinate"
            element={<NewSubordinate />}
          />
          <Route path="/promotion/invite-link" element={<InviteLink />} />

          {/* Account Pages */}

          <Route
            path="/account/transaction-history"
            element={<TransactionHistory />}
          />
          <Route path="/account/vip" element={<VipPage />} />
          <Route path="/account/bet-history" element={<BetHistory />} />
          <Route path="/account/avatar-change" element={<AvatarChange />} />
          <Route path="/account/support" element={<Support />} />
          <Route path="/account/chat-zone" element={<ChatZone />} />
          <Route path="/account/settings" element={<Setting />} />
          <Route
            path="/account/settings/PasswordChange"
            element={<PasswordChange />}
          />
          <Route path="/account/feedback" element={<Feedback />} />
          <Route path="/account/notification" element={<Notification />} />
          <Route path="/account/game-statistic" element={<GameStatistic />} />
          <Route path="/account/language" element={<Language />} />
          <Route path="/account/message" element={<Message />} />
          <Route path="/account/about-us" element={<AboutUs />} />

          {/* Wallet Pages */}

          <Route path="/wallet/deposit" element={<Deposit />} />
          <Route
            path="/usdt-deposit/:randomId/:timestamp"
            element={<USDTDepositPage />}
          />
          <Route
            path="/upi-deposit/:id1/:id2"
            element={<UPIManualDepositPage />}
          />

          <Route path="/deposit-history" element={<DepositHistory />} />
          <Route path="/withdraw-history" element={<WithdrawHistory />} />
          <Route path="/wallet/withdraw" element={<WithDraw />} />
          <Route path="/wallet/withdraw/add-bank" element={<AddBank />} />
          <Route
            path="/wallet/withdraw/usdtaddress"
            element={<UsdtAddress />}
          />
          <Route path="/upi-management" element={<UPIManagement />} />

          {/* Lottery Games route */}
          <Route path="/timer" element={<WingoPage />} />
          <Route path="/k3" element={<K3Page />} />
          <Route path="/5d" element={<FiveDPage />} />
          <Route path="/car-race" element={<CarRacingPage />} />

          {/* <Route path="/lucky-spinner" element={<LuckySpin />} /> */}
          <Route path="/lucky-spinner/event-desc" element={<EventDesc />} />
          <Route
            path="/lucky-spinner/event-details"
            element={<EventDetails />}
          />
          <Route
            path="/lucky-spinner/activity-rules"
            element={<ActivityRules />}
          />
        </Route>
        <Route
          path="/tms/deposit-recharge-history"
          element={<DepositRechargeHistory />}
        />
        <Route path="/tms/deposit-issue" element={<DepositIssue />} />

        <Route path="/tms/withdrawal-history" element={<WithdrawalHistory />} />
        <Route path="/tms/withdrawal-issue" element={<WithdrawalIssue />} />

        <Route path="/tms/change-ifsc" element={<ChangeIFSC />} />
        <Route path="/tms/change-bank-name" element={<ChangeBankName />} />
        <Route path="/tms/change-usdt" element={<AddUSDT />} />
        <Route
          path="/tms/modify-bank-details"
          element={<ModifyBankDetails />}
        />
        <Route path="/tms/activity-bonus" element={<ActivityBonus />} />
        <Route path="/tms/game-problem" element={<GameProblem />} />
        <Route path="/tms/others-issue" element={<Others />} />
        <Route path="/tms/refund-policy" element={<RefundProcess />} />

        <Route path="/tms/progress-query" element={<ProgressQueries />} />
        {/* Admin Authenticated Routes */}

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* <Route path="/admin/tournament-management" element={<TournamentManagement />} /> */}
          {/* <Route path="/admin/dynamic-spin-event" element={<DynamicSpinEventAdmin />} /> */}
          <Route
            path="/admin/pending-deposit"
            element={<PendingDepositRequest />}
          />
          <Route path="/admin/all-deposit" element={<AllDeposit />} />
          <Route
            path="/admin/pending-withdraw"
            element={<PendingWithdraws />}
          />
          <Route path="/admin/all-withdraw" element={<AllWithdraws />} />

          <Route path="/admin/create-giftcode" element={<CreateGift />} />
          {/* <Route
            path="/admin/create-notifications"
            element={<CreateNotifications />}
          /> */}
          <Route
            path="/admin/push-notifications"
            element={<PushNotificationAdmin />}
          />

          <Route path="/admin/upi-setting" element={<UpiComissionSetting />} />
          {/* <Route
            path="/admin/withdrawal-setting"
            element={<WithdrawalLimitSetting />}
          /> */}
          {/* <Route
            path="/admin/lucky-streak-setting"
            element={<LuckyStreakSetting />}
          /> */}
          {/* <Route path="/admin/lucky-spin" element={<LuckySpinSetting />} /> */}
          {/* <Route
            path="/admin/winning-streak-setting"
            element={<WinningStreakSetting />}
          /> */}
          <Route
            path="/admin/first-deposit-setting"
            element={<FirstDepositBonusSetting />}
          />
          <Route
            path="/admin/other-deposit-setting"
            element={<OtherDepositSetting />}
          />
          {/* <Route
            path="/admin/activity-reward"
            element={<ActivityRewardSetting />}
          />
          <Route
            path="/admin/invitation-bonus"
            element={<InvitationBonusSetting />}
          />
          <Route
            path="/admin/attendance-bonus"
            element={<AttendanceBonusSetting />}
          /> */}

          <Route path="/admin/active-users" element={<ActiveUsers />} />
          {/* <Route path="/admin/banned-users" element={<BannedUsers />} /> */}
          <Route path="/admin/user-details/:id" element={<UserDetails />} />
          {/* <Route path="/admin/edit-bank-detail" element={<EditBankDetails />} /> */}
          {/* <Route path="/admin/upi-management" element={<UPIManagementAdmin />} /> */}

          {/* <Route path="/admin/create-salary" element={<CreateSalary />} /> */}
          {/* <Route path="/admin/update-turn-over" element={<UpdateTurnOver />} /> */}

          {/* Games management */}
          <Route path="/admin/wingo-admin" element={<WingoGameMonitor />} />
          <Route path="/admin/k3-admin" element={<K3GameMonitor />} />
          <Route path="/admin/fived-admin" element={<FiveDGameMonitor />} />
          {/* <Route
            path="/admin/car-race-admin"
            element={<CarRaceGameMonitor />}
          /> */}

          {/* Illegal Bet Monitor */}
          {/* <Route path="/admin/illegal-bets" element={<IllegalBetMonitor />} /> */}

          {/* Profit and Loss */}
          {/* <Route path="/admin/profit-loss" element={<ProfitAndLoss />} />
          <Route
            path="/admin/agent-performance"
            element={<AgentPerformance />}
          />
          <Route path="/admin/ip-tracking" element={<IPInformation />} />
          <Route path="/admin/top-performance" element={<TopPerformance />} /> */}
          <Route path="/admin/api-transaction" element={<ApiTransaction />} />

          {/* VIP Page */}
          <Route path="/admin/vip-levels" element={<VIP />} />
          {/* <Route path="/admin/create-user" element={<CreateUser />} /> */}
          <Route path="/admin/referral-tree" element={<RefferalTree />} />
          <Route path="/admin/system-setting" element={<SystemSetting />} />
          {/* <Route
            path="admin/support-system"
            element={<SupportTicketSystem />}
          /> */}

          {/* Banner Poster Update */}
          {/* <Route path="admin/banner-poster-update" element={<BannerPosterUpdate />} /> */}
        </Route>
        <Route element={<AgentRoute />}>
          <Route
            path="/agent/agent-dashboard"
            element={<AgentPerformanceDashboard />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
