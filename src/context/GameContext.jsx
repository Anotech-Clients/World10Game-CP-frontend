import { createContext, useContext, useState, useEffect } from "react"
import { apidomain, clientPrefix, clientSecretKey, domain, frontendUrl } from "../utils/Secret"
import {
  CQ9_GAME_UIDS,
  EVO_GAME_UIDS,
  EVO_VIDEO_GAME_UIDS,
  FISH_GAME_UIDS,
  GAME_UIDS_365,
  IDEAL_GAME_UIDS,
  JDB_GAME_UIDS,
  JILI_GAME_UIDS,
  KM_GAME_UIDS,
  MG_GAME_UIDS,
  PG_GAME_UIDS,
  SEXY_GAME_UIDS,
  SPORT_GAME_UIDS,
  SPRIBE_GAME_UIDS,
  V8_GAME_UIDS,
} from "../data/GameUid"
import { UserContext } from "./UserState"
import { useAuth } from "./AuthContext"
import ErrorPopup from "../components/popups/ErrorPopup"
import NeedToDepositModal from "../components/common/NeedToDepositModal"
import OverlayWithProgress from "../components/utils/ApiLoading"

export const GameContext = createContext()

export const SPRIBE_GAME_ARRAY = {
  SPRIBE: SPRIBE_GAME_UIDS,
}

export const FISH_GAME_ARRAY = {
  // FISH: FISH_GAME_UIDS,
}

export const CASINO_GAME_ARRAY = {
  // IDEAL: IDEAL_GAME_UIDS,
  // EVO_Video: EVO_VIDEO_GAME_UIDS,
  // SEXY_Video: SEXY_GAME_UIDS,
  // V8: V8_GAME_UIDS,
};

export const SLOT_GAME_ARRAY = {
  // JILI: JILI_GAME_UIDS,
  // CQ9: CQ9_GAME_UIDS,
  // MG: MG_GAME_UIDS,
  // PG: PG_GAME_UIDS,
  // EVO_Electronic: EVO_GAME_UIDS,
  // JDB: JDB_GAME_UIDS,
  // KM: KM_GAME_UIDS
};

export const SPORT_GAME_ARRAY = {
  // SPORT: SPORT_GAME_UIDS,
}

export const PVC_GAME_ARRAY = {
  // V8: V8_GAME_UIDS,
  // Card365: GAME_UIDS_365,
}


// 🚀 FIXED: Define HOME_URL as a constant at the top level
const HOME_URL = "https://World 10 Game.testing.100Winsolutions.shop";

export const GameProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  // const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [isApiCoinAvailable, setIsApiCoinAvailable] = useState(true)
  const [thirdPartyWalletBalance, setThirdPartyWalletBalance] = useState(0)
  const [errorMessage, setErrorMessage] = useState("") // State for error message
  const [firstDepositMade, setFirstDepositMade] = useState(false)
  const [needToDepositMode, setNeedToDepositMode] = useState(false)

  const [openDepositModal, setOpenDepositModal] = useState(false);
  const {
    userData,
    getUserData,
  } = useContext(UserContext)

  const { axiosInstance } = useAuth()

  useEffect(() => {
    getUserData()
  }, [])

  const handleCloseDepositModal = () => {
    setOpenDepositModal(false);
    console.log("close neet to deposit modal")
  };
  
  const handleConfirmDeposit = () => {
    navigate("/wallet/deposit");
  };
  
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get("/api/user/me")

        if (userResponse.data.success && userResponse.data.body.user) {
          const userData = userResponse.data.body.user
          setFirstDepositMade(userData.isFirstDepositMode === true)
        }

        const depositModeResponse = await axiosInstance.get("/api/additional/need-to-deposit/mode")
        const { needToDepositMode } = depositModeResponse.data
        setNeedToDepositMode(needToDepositMode)
      } catch (error) {
        console.error("Error fetching user data or deposit mode:", error)
      }
    }

    fetchUserData()
  }, [axiosInstance])

  const transferWalletAmount = async (userUid) => {
    try {
      const transferResponse = await axiosInstance.post(
        `${domain}/api/api-wrapper/thirdpartywallet-transfer`,
        { uid: userUid },
        { withCredentials: true }
      )

      if (!transferResponse.data.success) {
        console.error("Wallet transfer failed:", transferResponse.data.message)
        return null
      }

      return {
        newWalletAmount: transferResponse.data.walletAmount ?? 0,
        newThirdPartyBalance: transferResponse.data.ThirdPartyWalletAmount ?? 0,
      }
    } catch (error) {
      console.error("Error during wallet transfer:", error)
      return null
    }
  }

  const handleApiClick = async (gameId, provider, type) => {
    if (isLoading) return; // Prevent multiple rapid clicks

    if (!userData?.uid) {
      console.error("User ID is missing.");
      getUserData();
      return;
    }

    if (needToDepositMode && !firstDepositMade) {
      setOpenDepositModal(true);
      return
    }

    setIsLoading(true);

    try {
      // 🔍 DEBUG: Log HOME_URL to verify it's correct
      console.log("🔍 [FRONTEND DEBUG] HOME_URL constant:", HOME_URL);
      console.log("🔍 [FRONTEND DEBUG] HOME_URL type:", typeof HOME_URL);
      console.log("🔍 [FRONTEND DEBUG] HOME_URL length:", HOME_URL.length);

      const clientSettings = {
        wrapperUrl: apidomain,
        apiKey: clientPrefix,
        apiSecret: clientSecretKey,
      };

      // 🚀 FIX: Safely reference game arrays to avoid ReferenceError
      const safeSlotArray = typeof SLOT_GAME_ARRAY !== "undefined" ? SLOT_GAME_ARRAY : {};
      const safeCasinoArray = typeof CASINO_GAME_ARRAY !== "undefined" ? CASINO_GAME_ARRAY : {};
      const safeScribeArray = typeof SPRIBE_GAME_ARRAY !== "undefined" ? SPRIBE_GAME_ARRAY : {};
      const safeFishArray = typeof FISH_GAME_ARRAY !== "undefined" ? FISH_GAME_ARRAY : {};
      const safeSportArray = typeof SPORT_GAME_ARRAY !== "undefined" ? SPORT_GAME_ARRAY : {};
      const safePvcArray = typeof PVC_GAME_ARRAY !== "undefined" ? PVC_GAME_ARRAY : {};

      let gameUid;
      if (type === "SLOT") {
        gameUid = safeSlotArray[provider]?.[gameId];
      } else if (type === "CASINO") {
        gameUid = safeCasinoArray[provider]?.[gameId];
      } else if (type === "SPRIBE") {
        gameUid = safeScribeArray[provider]?.[gameId];
      } else if (type === "FISH") {
        gameUid = safeFishArray[provider]?.[gameId];
      } else if (type === "SPORT") {
        gameUid = safeSportArray[provider]?.[gameId];
      } else if (type === "PVC") {
        gameUid = safePvcArray[provider]?.[gameId];
      }

      if (!gameUid) {
        console.error(`No game UID found for gameId: ${gameId}, provider: ${provider}, type: ${type}`);
        // setErrorMessage(`Game not found: ${gameId} - ${provider} - ${type}`);
        setErrorMessage(`Comming soon...`);
        setIsLoading(false);
        return;
      }

      // 🚀 CRITICAL FIX: Build the request payload properly
      const requestPayload = {
        gameId: gameUid,
        type: type,
        home_url: HOME_URL, // 🚀 Use the constant directly
        wrapperUrl: apidomain,
        apiKey: clientPrefix,
        apiSecret: clientSecretKey,
      };

      // 🔍 DEBUG: Log the complete payload
      console.log("🔍 [FRONTEND DEBUG] Complete request payload:");
      console.log(JSON.stringify(requestPayload, null, 2));
      console.log("🔍 [FRONTEND DEBUG] Payload home_url specifically:", requestPayload.home_url);
      console.log("🔍 [FRONTEND DEBUG] Payload home_url type:", typeof requestPayload.home_url);

      console.log("🏠 [FRONTEND] Launching game with home_url:", HOME_URL);

      const response = await axiosInstance.post(
        `${domain}/api/huidu/launch-game-seamless`,
        requestPayload,
        { withCredentials: true }
      );

      console.log("🔍 [FRONTEND DEBUG] Response received:", response.status);

      if (response.status === 200 && response.data.data?.game_launch_url) {
        console.log("🎮 [FRONTEND] Game launched successfully!");
        console.log("🏠 [FRONTEND] home_url used:", response.data.data.home_url_used);
        console.log("🏠 [FRONTEND] home_url source:", response.data.data.home_url_source);
        console.log("🏠 [FRONTEND] home_url from frontend:", response.data.data.home_url_from_frontend);

        // Update local wallet balances
        if (response.data.data.main_wallet_transferred) {
          setWalletBalance(response.data.data.main_wallet_transferred);
        }
        if (response.data.data.final_game_balance) {
          setThirdPartyWalletBalance(response.data.data.final_game_balance);
        }

        // Open the game URL
        console.log("🎮 [FRONTEND] Redirecting to game URL:", response.data.data.game_launch_url);
        window.location.href = response.data.data.game_launch_url;
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } else {
        console.error("Failed to launch game:", response.data.message);
        setErrorMessage(response.data.message || "Failed to launch game");
      }
    } catch (error) {
  setIsLoading(false);
  console.error("🔍 [FRONTEND DEBUG] Error during game launch:", error);

  // 🚀 Handle any missing game array constants gracefully
  if (error instanceof ReferenceError && error.message.includes("GAME_ARRAY")) {
    setErrorMessage("Comming soon...");
    return; // Stop further error handling
  }

  if (error.response?.data?.errorCode === 4008) {
    setErrorMessage("API server is busy");
  } else if (
    error.response?.data?.message === "Insufficient API coins or inactive subscription"
  ) {
    setIsApiCoinAvailable(false);
    console.error("response", error.response.data);
  } else {
    console.error("Error during game launch:", error);
    setErrorMessage("API server is busy, please try again later");
  }
}
 finally {
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 1000);
    }
  };

  // Handler to clear error message
  const clearErrorMessage = () => {
    setErrorMessage("")
  }

  return (
    <GameContext.Provider
      value={{
        walletBalance,
        thirdPartyWalletBalance,
        handleApiClick,
        transferWalletAmount,
        isApiCoinAvailable,
        setIsApiCoinAvailable,
        isLoading,   
        firstDepositMade,     
        needToDepositMode
      }}
    >
      {children}
      <OverlayWithProgress visible={isLoading} />
      <NeedToDepositModal
        open={openDepositModal}
        onClose={handleCloseDepositModal}
        onConfirm={handleConfirmDeposit}
      />
      {/* Render ErrorPopup when there's an error message */}
      {errorMessage && (
        <ErrorPopup message={errorMessage} onClose={clearErrorMessage} />
      )}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)