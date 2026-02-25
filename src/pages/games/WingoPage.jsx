import React, { useState, useEffect, useRef, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../../components/layout/Mobile";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
// import MusicOffIcon from "@mui/icons-material/MusicOff";
import { Button } from "@mui/material";
// import NoteIcon from "@mui/icons-material/Note";
import { Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Backdrop } from "@mui/material";
// import axios from "axios";
// import Table from "@mui/material/Table";
// import TableCell from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import TableBody from "@mui/material/TableBody";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ButtonGroup, styled } from "@mui/material";
import { domain, wssdomain } from "../../utils/Secret";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import GameWalletCard from "../../components/games/common/GameWalletCard";
import WingoHtp from "../../components/games/wingo/WingoHtp";
import GameHistory from "../../components/games/wingo/GameHistory";
import WingoChart from "../../components/games/wingo/WingoChart";
import { UserContext } from "../../context/UserState";
import ErrorPopup from "../../components/popups/ErrorPopup";
import CountdownTimer from "../../components/games/common/CountdownTimer";
import WingoMyHistory from "../../components/games/wingo/WingoMyHistory";
import { useAuth } from "../../context/AuthContext";
// import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
// import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 4,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.svg",
    subtitle: "30Sec",
  },
  {
    id: 1,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.svg",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.svg",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.svg",
    subtitle: "5Min",
  },
];

const tabData = [
  { label: "Game History" },
  { label: "Chart" },
  { label: "My History" },
];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={0} m={0} overflow={"hidden"} sx={{ display: "flex", justifyContent: "center" }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "5px",
  padding: "3px 0px",
  gap: "5.5px",
}));
const StyledButton = styled(Button)(({ theme, active, isRandom }) => ({
  backgroundColor: isRandom ? "#323738" : active ? "#17B15E" : "#232626",
  color: isRandom ? "#D23838" : active ? "#ffffff" : "#B3BEC1",
  fontSize: "12px",
  padding: "3px 8px",
  border: isRandom ? "1px solid #D23838" : "none",
  borderRadius: isRandom ? "8px" : active ? "8px" : "8px",
  [theme.breakpoints.down(400)]: {
    fontSize: "10px", // Font size for screens below 400px

    padding: "3px 3px",
  },
  // "&:hover": {
  //   backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
  //   border: isRandom ? "1px solid #D23838" : "none",
  // },
}));

const StyledButton2 = styled(Button)(({ theme, active }) => ({
  padding: "10px",
  margin: "5px",
}));

const multipliers = [
  { label: "Random", value: "random", isRandom: true },
  { label: "X1", value: 1 },
  { label: "X5", value: 5 },
  { label: "X10", value: 10 },
  { label: "X20", value: 20 },
  { label: "X50", value: 50 },
  { label: "X100", value: 100 },
];

const WingoPage = ({ timerKey }) => {
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("30sec");
  const [rows, setRows] = useState([]);
  // const [page, setPage] = useState(1);
  const [betPage, setBetPage] = useState(1);
  const [gameTotalPage, setGameTotalPage] = useState(1);
  const [betTotalPage, setBetTotalPage] = useState(1);
  // Tab-specific pagination state
  const [historyPage, setHistoryPage] = useState(1);
  const [chartPage, setChartPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  // const [user, setUser] = useState(null);
  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(1);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPeriodId, setBetPeriodId] = useState(null);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState("");
  // const [value, setValue] = useState(0);
  const [bets, setBets] = useState([]);
  const [selectedColor, setSelectedColor] = useState("rgb(253,86,92)");
  const [winloss, setWinLoss] = useState(0);
  // const [popupperiod, setPopupPeriod] = useState(0);
  const [popupresult, setPopupResult] = useState("");
  const [popupperiodid, setPopupPeriodId] = useState(0);
  const [popupTimer, setPopupTimer] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const theme = useTheme();
  // Add isPlacingBet state at the top of your component
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(400));
  const [popupQueue, setPopupQueue] = useState([]); // new queue to manage sequential popups
  const [currentBetIndex, setCurrentBetIndex] = useState(0); // tracks current popup being shown
  const [processedPeriodIds, setProcessedPeriodIds] = useState(new Set()); // Track processed period IDs
  const [accountType, setAccountType] = useState("Normal");
  // First, add this with your other state declarations at the top of your component
  const [lastPeriodId, setLastPeriodId] = useState(null);
  const [remainingTimeInMs, setRemainingTimeInMs] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userBets, setUserBets] = useState(() => {
    // Load userBets from localStorage on component mount
    const storedUserBets = localStorage.getItem("userBets");
    return storedUserBets ? JSON.parse(storedUserBets) : [];
  });

  // Save userBets to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userBets", JSON.stringify(userBets));
  }, [userBets]);

  const navigate = useNavigate();
  const { getWalletBalance, userWallet, userData } = useContext(UserContext);
  const { axiosInstance, refreshAccessToken } = useAuth();

  const [agreed, setAgreed] = useState(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSmall(true);
        setIsBig(false);
      } else {
        setIsSmall(false);
        setIsBig(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    setAgreed((prev) => !prev);
  };
 const handleToggle2 = () => {
    setShow(!show); // Toggle state on click
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    // No need to trigger a fetch here as the useEffect will handle it
  };
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    let expiryTimeoutId = null;

    const getTimeRemainingInPeriod = () => {
      const timerMap = {
        "30Sec": 30000,
        "1Min": 60000,
        "3Min": 180000,
        "5Min": 300000,
      };

      const periodDuration = timerMap[selectedTimer] || 60000;
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      let timeRemaining;

      switch (selectedTimer) {
        case "30Sec":
          // const currentHalf = Math.floor(seconds / 30);
          const halfProgress = (seconds % 30) * 1000 + milliseconds;
          timeRemaining = 30000 - halfProgress;
          break;

        case "1Min":
          timeRemaining = periodDuration - (seconds * 1000 + milliseconds);
          break;

        case "3Min":
          const threeMinProgress =
            (Math.floor(now.getMinutes() % 3) * 60 + seconds) * 1000 +
            milliseconds;
          timeRemaining = periodDuration - threeMinProgress;
          break;

        case "5Min":
          const fiveMinProgress =
            (Math.floor(now.getMinutes() % 5) * 60 + seconds) * 1000 +
            milliseconds;
          timeRemaining = periodDuration - fiveMinProgress;
          break;

        default:
          timeRemaining = periodDuration;
      }

      return timeRemaining > 0 ? timeRemaining : periodDuration;
    };

    const setupNextFetch = () => {
      if (!isMounted) return;

      const timeRemaining = getTimeRemainingInPeriod();
      setRemainingTimeInMs(timeRemaining);

      if (timeoutId) clearTimeout(timeoutId);
      if (expiryTimeoutId) clearTimeout(expiryTimeoutId);

      timeoutId = setTimeout(() => {
        if (isMounted) {
          setupNextFetch();
        }
      }, timeRemaining);
    };

    // Just setup the timer without fetching
    setupNextFetch();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (expiryTimeoutId) clearTimeout(expiryTimeoutId);
    };
  }, [selectedTimer]);

  // Single effect to handle both selectedTimer changes and periodId changes
  const lastSelectedTimerRef = useRef(selectedTimer);
  const lastPeriodIdRef = useRef(periodId);

  // Optional: Monitor remaining time for debugging
  useEffect(() => {
    if (remainingTimeInMs !== null) {
      // //console.log(`Time remaining: ${remainingTimeInMs/1000} seconds`);
    }
  }, [remainingTimeInMs]);

  const timerTypeMap = {
    "30sec": "THIRTY_TIMER",
    "1min": "ONE_MINUTE_TIMER",
    "3min": "THREE_MINUTE_TIMER",
    "5min": "FIVE_MINUTE_TIMER",
    "10min": "TEN_MINUTE_TIMER",
  };

  const invertedTimerTypeMap = Object.fromEntries(
    Object.entries(timerTypeMap).map(([key, value]) => [value, key])
  );

  // Function to get the value using the key
  function getOriginalKey(invertedKey) {
    return invertedTimerTypeMap[invertedKey] || null; // Return null if the key doesn't exist
  }

  const wordToNumber = (word) => {
    const numbers = {
      ZERO: 0,
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
      SIX: 6,
      SEVEN: 7,
      EIGHT: 8,
      NINE: 9,
    };
    return numbers[word] !== undefined ? numbers[word] : word;
  };

  const numberToWord = (number) => {
    const words = {
      0: "ZERO",
      1: "ONE",
      2: "TWO",
      3: "THREE",
      4: "FOUR",
      5: "FIVE",
      6: "SIX",
      7: "SEVEN",
      8: "EIGHT",
      9: "NINE",
    };
    return words[number] !== undefined ? words[number] : number;
  };

  const handleTimerChange = (id, subtitle) => {
    setActiveId(id);
    const newTimerKey = subtitle.toLowerCase();
    setSelectedTimer(newTimerKey);
    setHistoryPage(1);
    setChartPage(1);
    setBetPage(1)
    // navigate(`/timer/${newTimerKey}`);
  };

  const handleClick = (id) => {
    if (!timerKey) {
      let newTimerKey;
      switch (id) {
        case 1:
          newTimerKey = "1min";
          break;
        case 2:
          newTimerKey = "3min";
          break;
        case 3:
          newTimerKey = "5min";
          break;
        case 4:
          newTimerKey = "30sec"; // Handle 30-second timer
          break;
        default:
          newTimerKey = "30sec";
      }
      // navigate(`/timer/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle.toLowerCase());
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to 20 Lottery, where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 20 Lottery. Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on 20 Lottery ",
    "20 Lottery welcomes you here !!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 500); // This should be equal to the exit duration below
    }, 3000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  const navigateToPage = () => {
    navigate(-1);
  };

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
    setAgreed(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setMultiplier(1)
    handleMultiplier(1)
    setActiveButton(1)
  }

  const handleBetAmount = (amount) => {
    setBetAmount(parseFloat(amount).toFixed(2));
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const fetchResults = async () => {
    const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER";
    const currentPage = activeTab === 0 ? historyPage : chartPage;
    try {
      const response = await axiosInstance.get(
        `${domain}/api/master-game/wingo/history`,
        {
          params: { timerType: timerType, page: currentPage, limit: 10 },
          withCredentials: true,
        }
      );

      // const filteredData = response.data.filter(
      //   (item) => item.timer === selectedTimer
      // )

      // //console.log("response", response);
      setGameTotalPage(response.data.data.pagination.totalPages);
      setRows(response.data.data.history);
      setLastPeriodId(periodId);
      lastSelectedTimerRef.current = selectedTimer;
      lastPeriodIdRef.current = periodId;
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    if (
      lastSelectedTimerRef.current !== selectedTimer ||
      (periodId && periodId !== lastPeriodIdRef.current)
    ) {
      fetchResults();
    }
  }, [selectedTimer, periodId, domain]);

  useEffect(() => {
    if (remainingTime <= 0) {
      fetchResults();
      const timeout = setTimeout(() => {
        fetchBetsHistory();
      }, 3000); // 3 seconds
      return () => clearTimeout(timeout); // cleanup
      // //console.log("bets ----->", remainingTime);
    }
  }, [remainingTime]);

  const fetchBetsHistory = async () => {
    const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER";
    try {
      const response = await axiosInstance.get(
        `${domain}/api/master-game/wingo/bet-history`,
        {
          params: { timerType: timerType, page: betPage, limit: 10 },
          withCredentials: true,
        }
      );

      const betData = response.data.data.bets;
      setBets(betData);
      setBetTotalPage(response.data.data.pagination.totalPages);

      // Filter for resolved bets with result available and matching the user's periodId
      const resolvedBets = betData.filter(
        (bet) =>
          bet.result &&
          userBets.includes(bet.periodId) &&
          !processedPeriodIds.has(bet.periodId) // Skip already processed bets
      );

      // Add resolved bets to the popup queue if they haven't been shown yet
      if (resolvedBets.length > 0) {
        setPopupQueue((prevQueue) => {
          // Filter out duplicates (bets already in the queue)
          const newBets = resolvedBets.filter(
            (bet) =>
              !prevQueue.some(
                (queuedBet) => queuedBet.periodId === bet.periodId
              )
          );
          return [...prevQueue, ...newBets];
        });

        // Mark these periodIds as processed
        setProcessedPeriodIds((prevSet) => {
          const newSet = new Set(prevSet);
          resolvedBets.forEach((bet) => newSet.add(bet.periodId));
          return newSet;
        });

        // Start processing the queue if it's not already running
        if (currentBetIndex === -1) {
          setCurrentBetIndex(0);
        }
      }
    } catch (error) {
      console.error("Error fetching betting history:", error);
      setTimeout(async () => {
        try {
          const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER";
          const retryResponse = await axiosInstance.get(
            `${domain}/api/master-game/wingo/bet-history`,
            {
              params: { timerType: timerType, page: betPage, limit: 10 },
              withCredentials: true,
            }
          );
          setBets(retryResponse.data.data.bets);
          setBetTotalPage(retryResponse.data.data.pagination.totalPages);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }, 1000);
    }
  };
  useEffect(() => {
    fetchBetsHistory();
    fetchResults()
  }, [betPage, historyPage, chartPage, activeTab]);

  const totalPage = bets.length;
   const handlePlaceBet = async () => {
    const totalBet = betAmount;

    // Input validations
    if (betAmount === 0) {
      setPopupMessage("You can't place a bet with 0 amount.");
      setIsPopupVisible(true);
      // Hide the popup after 2 seconds
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      return;
    }
    
    if (["06", "05", "04", "03", "02", "01"].includes(remainingTime)) {
      setPopupMessage("You can't place a bet in the last 5 seconds.");
      setIsPopupVisible(true);
      // Hide the popup after 2 seconds
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      return;
    }
 setErrorMessage("")
    const betData = {
      selectedItem: numberToWord(selectedItem).toUpperCase(),
      betAmount: parseInt(totalBet),
      multiplier: multiplier,
      selectedTimer: timerTypeMap[selectedTimer] || "THIRTY_TIMER",
      periodId: periodId,
      userType: userData.accountType,
    };

    setIsPlacingBet(true); // Enable loader

    try {
      setLastAlertedPeriodId(periodId);
      await axiosInstance.post(`${domain}/api/master-game/wingo/bet`, betData, {
        withCredentials: true,
      });

      await fetchBetsHistory();
      getWalletBalance();
      setBetAmount(1);
      setMultiplier(1);
      setSelectedItem(null);
      setDisplayBetAmount(1);
      setCustomBetAmount("");
      setBetPlaced(true);
      setBetPeriodId(periodId);
      handleCloseDrawer();
      setActiveBetAmount(1);
      setPopupMessage("Bet placed successfully");
      setIsPopupVisible(true);
      // Hide the popup after 2 seconds
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      fetchBetsHistory();
    } catch (err) {
      console.error("Error placing bet:", err)
      if (err.response?.data?.error?.includes("Insufficient balance")) {
       setPopupMessage("Insufficient balance");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      } else {
        setPopupMessage(
          err.response?.data?.error || "Failed to place bet. Please try again."
        );
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
      handleCloseDrawer();
    } finally {
      setIsPlacingBet(false) // Disable loader
    }
  }

  useEffect(() => {
    setDisplayBetAmount(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const handleCancelBet = () => {
    setSelectedItem("");
    setCustomBetAmount("");
    setActiveBetAmount(1);
    setBetAmount(1);
    setMultiplier(1);
    setTotalBet(1);
    handleCloseDrawer();
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setTimeout(() => {
      setIsPopupVisible(false);
    }, 2000);
  };
  useEffect(() => {
    handleClick(images[0].id);
  }, []);

  // const timeParts = (remainingTime || "00:00").split(":");
  // const minutes = timeParts[0] || "00";
  // const seconds = timeParts[1] || "00";
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // const toggleSound = () => {
  //   setIsSoundOn(!isSoundOn);
  // };

  useEffect(() => {
    if (remainingTime >= "01" && remainingTime <= "05") {
      setOpenDialog(true);
      handleCloseDrawer()
      if (isSoundOn && remainingTime !== lastPlayedTime) {
        countdownSound.play();
        setLastPlayedTime(remainingTime);
        setTimeout(() => {
          countdownSound.pause();
          countdownSound.currentTime = 0;
        }, 1000 - countdownSound.duration * 1000);
      }
    } else {
      setOpenDialog(false);
      if (isSoundOn) {
        countdownSound.pause();
        countdownSound.currentTime = 0;
        setLastPlayedTime(null);
      }
    }
    // //console.log("popupRemaningTime:", popupRemaningTime)
  }, [remainingTime, isSoundOn]);

  const handleEventSelection = (event) => {
    switch (event) {
      case "violet":
        setSelectedColor("#9B48DB");
        break;
      case "green":
        setSelectedColor("RGB(64,173,114)");
        break;
      case "red":
        setSelectedColor("RGB(253,86,92)");
        break;
      case "yellow":
        setSelectedColor("RGB(71,129,255)");
        break;
      case "blue":
        setSelectedColor("RGB(253,86,92)");
        break;
      case "big":
        setSelectedColor("rgb(255,168,46)");
        break;
      case "small":
        setSelectedColor("RGB(71,129,255)");
        break;
      case "mix1":
        setSelectedColor(
          "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
        );
        break;
      case "mix2":
        setSelectedColor(
          // "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
          "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
        );
        break;
      default:
        setSelectedColor("rgb(253,86,92)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");
  const [displayBetAmount, setDisplayBetAmount] = useState(1);

  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value).toFixed(2);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };

  const getColorAndSize = (popupresult) => {
    popupresult = wordToNumber(popupresult);

    let color = "unknown";
    let size = "";

    if ([1, 3, 7, 9].includes(popupresult)) {
      color = "green";
    } else if ([2, 4, 6, 8].includes(popupresult)) {
      color = "red";
    } else if (popupresult === 0) {
      color = "red/violet";
    } else if (popupresult === 5) {
      color = "green/violet";
    }
    size = popupresult >= 5 ? "big" : "small";
    return { color, number: popupresult, size }; // Return an object
  };

  // Updated LotteryResultsDisplay component
  const LotteryResultsDisplay = ({ popupresult }) => {
    const result = wordToNumber(popupresult);
    const { color, number, size } = getColorAndSize(result);
    // Helper function for color styles
    const getBackgroundStyle = (value) => {
      if (value.toLowerCase().includes("violet")) {
        if (value.toLowerCase().includes("red")) {
          return "linear-gradient(135deg, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"; // Red-Violet gradient
        }
        if (value.toLowerCase().includes("green")) {
          return "linear-gradient(135deg, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"; // Green-Violet gradient
        }
        return "RGB(182,89,254)"; // Violet
      } else if (value === "green") {
        return "RGB(64,173,114)"; // Green
      } else if (value === "red") {
        return "RGB(253,86,92)"; // Red
      } else if (value === "big") {
        return "#ffa82e"; // Orange for big
      } else if (value === "small") {
        return "#1876d2"; // Blue for small
      }
      return "#597ba4"; // Default blue
    };
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Typography style={{ color: gameResult ? "white" : "#597ba4", fontSize: "14px" }}>Lottery results:</Typography>
        {/* Color Box */}
        <div
          style={{
            background: getBackgroundStyle(color),
            padding: isSmallScreen2 ? "2px 5px" : "2px 8px",
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            boxShadow: "0 2px 4px white",
            // border:"1px solid white"
          }}
        >
          <Typography
            style={{
              color: "#ffffff",
              textTransform: "capitalize",
              textWrap: "nowrap",
            }}
          >
            {color}
          </Typography>
        </div>
        {/* Number Circle */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: getBackgroundStyle(color),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid white"
          }}
        >
          <Typography style={{ color: "#ffffff", fontWeight: "bold" }}>
            {number}
          </Typography>
        </div>

        {/* Size Box */}
        <div
          style={{
            background: getBackgroundStyle(color),
            padding: isSmallScreen2 ? "2px 5px" : "2px 8px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px white",
          }}
        >
          <Typography style={{ color: "#ffffff", textTransform: "capitalize" }}>
            {size}
          </Typography>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setTotalBet(betAmount)
  }, [betAmount])

  const firstFiveRows = rows?.slice(0, 5);

  const [selectedMultiplier, setSelectedMultiplier] = useState(1);

  const handleMultiplierChange = (multiplier) => {
    if (!multiplier.isRandom) {
      setSelectedMultiplier(multiplier.value);
    } else {
      // In a real app, you'd generate a random multiplier here
      const randomMultipliers = [1, 5, 10, 20, 50, 100];
      const randomIndex = Math.floor(Math.random() * randomMultipliers.length);
      setSelectedMultiplier(randomMultipliers[randomIndex]);
    }
  };

  // Define ref outside useEffect
  const lastFetchedPeriod = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let fetchTimeout = null;

    // Calculate next fetch time based on bets data
    const calculateNextFetchTime = (betsData) => {
      if (!betsData || !betsData.length) return null;

      const pendingBets = betsData.filter(
        (bet) => bet.result === " " && bet.selectedTimer === selectedTimer
      );

      if (!pendingBets.length) return null;

      // Calculate expiry times for all pending bets
      const expiryTimes = pendingBets.map((bet) => {
        const betTime = new Date(bet.timestamp).getTime();
        return betTime + parseInt(bet.selectedTimer) * 1000;
      });

      // Get the soonest expiry time
      return Math.min(...expiryTimes);
    };

    const fetchBets = async () => {
      // Don't fetch if unmounted or if period hasn't changed
      if (
        !isMounted ||
        (lastFetchedPeriod.current === periodId && periodId !== "Loading...")
      ) {
        return;
      }

      try {
        const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER"

        const response = await axiosInstance.get(
          `${domain}/api/master-game/wingo/bet-history`,
          {
            params: {
              timerType: timerType,
              page: 1,
              limit: 10,
            },
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        // Update last fetched period
        lastFetchedPeriod.current = periodId;

        setBets(response.data.data.bets);

        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);

        // Handle popup queue updates - only show the LATEST bet
        if (
          currentPeriodId &&
          currentPeriodId !== "Loading..." &&
          currentPeriodId !== previousAlertedPeriodId
        ) {
          const completedBets = response.data.data.bets.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              bet.result !== " "
          );

          // Only show the latest bet popup instead of all
          if (completedBets.length > 0) {
            // Get just the latest bet (first in the array)
            const latestBet = completedBets[0];
            setPopupQueue([latestBet]); // Just add this one bet to the queue
            setCurrentBetIndex(0);
            setLastAlertedPeriodId(currentPeriodId);
          }
        }

        // Calculate and schedule next fetch only if there are pending bets
        const nextFetchTime = calculateNextFetchTime(response.data);

        if (nextFetchTime) {
          const delay = Math.max(0, nextFetchTime - Date.now());

          // Clear existing timeout before setting new one
          if (fetchTimeout) {
            clearTimeout(fetchTimeout);
          }

          fetchTimeout = setTimeout(() => {
            if (isMounted) {
              fetchBets();
            }
          }, delay);
        }
      } catch (err) {
        console.error("Error fetching user bet history data:", err);

        // Clear existing timeout before setting retry
        if (fetchTimeout) {
          clearTimeout(fetchTimeout);
        }

        // Retry after 5 seconds on error
        fetchTimeout = setTimeout(() => {
          if (isMounted) {
            fetchBets();
          }
        }, 5000);
      }
    };

    // Only initiate fetch if periodId changes or selectedTimer changes
    if (
      periodId &&
      periodId !== "Loading..." &&
      (lastFetchedPeriod.current !== periodId || !lastFetchedPeriod.current)
    ) {
      fetchBets();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };
  }, [periodId, selectedTimer, lastAlertedPeriodId, domain]); // Only essential dependencies


  // Replace the popup display effect
  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex === 0) {
      const delay = setTimeout(() => {
        const currentBet = popupQueue[0]; // Only get the first (latest) bet

        if (!currentBet) {
          console.error("currentBet is undefined or null.");
          return;
        }

        const announceBetResult = async () => {
          setOpen(true);
          setPopupResult(currentBet.result);
          setPopupPeriodId(currentBet.periodId);
          setPopupTimer(currentBet.selectedTimer);
          setGameResult(currentBet.isWin);
          setDialogContent(currentBet.isWin ? "Bonus" : "You lost the bet");
          setWinLoss(currentBet.isWin ? currentBet.winAmount : currentBet.actualBetAmount);
        };

        announceBetResult();

        const timer = setTimeout(() => {
          setOpen(false);
          // Reset the queue after showing the one popup
          setPopupQueue([]);
          setCurrentBetIndex(-1);
        }, 2500);

        // Clean up the timer when component unmounts or dependencies change
        return () => clearTimeout(timer);
      }, 3000); // 3-second delay

      // Cleanup for outer delay
      return () => clearTimeout(delay);
    }
  }, [popupQueue, currentBetIndex]);


  // const seconds1 = remainingTime ? remainingTime.split(":")[1] : "00";

  // Determine the length of the seconds string
  // const length = seconds1.length;

  // Split the seconds into two halves
  // const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const firstHalf = 0;
  // const secondHalf = remainingTime?.slice(Math.ceil(length / 2))
  const secondHalf = remainingTime;


  return (
    <>
      <Mobile>
        {/* <CountdownTimer setPeriodId={setPeriodId} selectedTimer={selectedTimer}/> */}
        <div style={{ backgroundColor: "#232626" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 5000,
              backgroundColor: "#232626",
              padding: "4px 0px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton style={{ color: "white" }} onClick={navigateToPage}>
                <ArrowBackIosNewIcon sx={{ fontSize: "18px", ml: 0.5 }} />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/logo/colorLogo.webp"
                alt="logo"
                style={{ width: "90px", }}
                onClick={() => navigate('/')}
              />
            </Grid>
            <Grid item xs={3} textAlign="right">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "10px", // Space between the images
                  mr: "20px",
                }}
              >
                <Box
                  onClick={() => navigate("/customer-service")}
                  component="img"
                  src="../assets/icons/customerCare.webp"
                  alt="Support Agent Icon"
                  sx={{ width: "25px", height: "25px", cursor: "pointer" }} // Cursor pointer for interactivity
                />
                {isSoundOn && (
                  <Box
                    component="img"
                    src="../assets/icons/sound.webp"
                    alt="Sound Icon"
                    onClick={() => setIsSoundOn(!isSoundOn)} // Toggle state to hide the icon
                    sx={{ width: "25px", height: "25px", cursor: "pointer" }} // Cursor pointer for interactivity
                  />
                )}
                {!isSoundOn && (
                  <Box
                    component="img"
                    src="../assets/icons/soundMute.webp"
                    onClick={() => setIsSoundOn(!isSoundOn)} // Toggle state to show the icon
                    sx={{ width: "25px", height: "25px", cursor: "pointer" }}
                  />
                )}
              </Box>
              {/* <IconButton style={{ color: "white" }}>
                <SupportAgentIcon />
              </IconButton>

              <IconButton
                style={{ color: "white" }}
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
              </IconButton> */}
            </Grid>
          </Grid>

          {/* Wallet card */}

          <GameWalletCard />

          {/* timer filter */}
          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              // maxWidth: "93%",
              width: "calc(100% - 30px)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "-65px",
              backgroundColor: "#3a4142",
              borderRadius: "13px",
              color: "white",
            }}
          >
            {images.map((image) => (
              <Grid
                item
                xs={3}
                key={image.id}
                onClick={() => handleTimerChange(image.id, image.subtitle)}
                style={{
                  cursor: "pointer",
                  background:
                    activeId === image.id
                      ? "linear-gradient(90deg,#24ee89,#9fe871)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={activeId === image.id ? image.altSrc : image.src}
                  alt={image.subtitle}
                  style={{ width: "60%" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    color: activeId === image.id ? "black" : "#B3BEC1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Win Go
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {image.subtitle}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
          {/* remaning time card */}
          <Grid
            container
            spacing={0}
            mt={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "calc(100% - 30px)",
              // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundImage: 'url("/assets/wingo/orangeCard.webp")',
              backgroundSize: "contain",
              aspectRatio: 3 / 1,
              backgroundRepeat: "no-repeat",
              backgroundOrigin: "content-box",
              backgroundPosition: "center",
              // height: "100%",
              // width: "auto"
            }}
          >
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
                px: "12px"
                // alignItems: "flex-start",
                // pl: "4%",
              }}
            >
              <Grid item sx={{}}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "black",
                    borderColor: "black",
                    padding: "0.8px 22px",
                    textTransform: "initial",
                    borderRadius: "20px",
                    width: "100%",
                    fontSize: "11px"
                  }}
                  // startIcon={<NoteIcon />}
                  onClick={handleOpenPopup}
                >
                  <Box
                    // onClick={handleNext}
                    component="img"
                    src="../assets/wingo/how.webp"
                    alt=""
                    sx={{ width: "20px", height: "21px" }} // Adjust the size as needed
                  />
                  How to play
                </Button>
                <WingoHtp isOpen={isPopupOpen} onClose={handleClosePopup} />
              </Grid>
              <Grid item sx={{ textAlign: "left", ml: "5px" }}>
                <Typography
                  variant="caption"
                  sx={{ color: "black" }}
                >{`Win Go ${selectedTimer}`}</Typography>
              </Grid>
              <Grid
                item
                sx={{
                  display: "flex",
                  // marginBottom: "10px",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {firstFiveRows?.map((row, index) => (
                  <img
                    key={index}
                    src={`/assets/wingo/${wordToNumber(
                      row.numberOutcome
                    )}.webp`}
                    className="auja"
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "16%",

                      // marginRight:
                      //   index !== firstFiveRows?.length - 1 ? "5px" : "0",
                    }}
                  />
                ))}
              </Grid>
            </Grid>
            <CountdownTimer
              setPeriodId={setPeriodId}
              periodId={periodId}
              selectedTimer={selectedTimer}
              remainingTime={remainingTime}
              setRemainingTime={setRemainingTime}
              gameType="wingo"
            />
            {/* <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                pr: "4%",
              }}
            >
              <Grid item>
                <Typography variant="caption" sx={{ color: "white" }}>
                  Time Remaining
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "12px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {minutes[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "8px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {minutes[1]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      marginTop: "8px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "20px",
                      margin: "0 2px",
                    }}
                  >
                    :
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      marginTop: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {seconds[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      fontWeight: "bold",
                      marginTop: "8px",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {seconds[1]}
                  </Box>
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  {periodId ? periodId : ""}
                </Typography>
              </Grid>
            </Grid> */}
          </Grid>

          <Grid
            container
            mt={1}
            spacing={2}
            sx={{
              // boxShadow: "0px 4px 8px #f2f2f1",
              marginLeft: "auto",
              marginRight: "auto",
              width: "calc(100% - 30px)",
              borderRadius: "15px",
              backgroundColor: "#323738",
              position: "relative",
              pointerEvents: openDialog ? "none" : "auto",
              padding: "10px"
            }}
          >
            <div
              className="overlay"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "15px",
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 100,
                display: openDialog ? "inline-block" : "none",
                cursor: "not-allowed",
              }}
            ></div>
            <div
              style={{
                width: "300px",
                height: "200px",
                display: openDialog ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                color: "#24ee89",
                fontWeight: "bold",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 900,
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#3a4142",
                  }}
                >
                  {firstHalf}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#3a4142",
                  }}
                >
                  {secondHalf}
                </p>
              </div>
            </div>
            {/* First Row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button
                onClick={() => {
                  handleOpenDrawer("green");
                  handleEventSelection("green");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#17B15E",
                  "&:hover": {
                    backgroundColor: "#17B15E",
                  },
                  width: "100px",
                  borderRadius: "0 10px 0 10px",
                  textTransform: "none"
                }}
              >
                Green
              </Button>
              <Button
                onClick={() => {
                  handleOpenDrawer("violet");
                  handleEventSelection("violet");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#9B48DB",
                  "&:hover": {
                    backgroundColor: "#9B48DB",
                  },
                  width: "100px",
                  borderRadius: "5px",
                  color: "white",
                  textTransform: "none"
                }}
              >
                Violet
              </Button>
              <Button
                onClick={() => {
                  handleOpenDrawer("red");
                  handleEventSelection("red");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#D23838",
                  "&:hover": {
                    backgroundColor: "#D23838",
                  },
                  width: "100px",
                  borderRadius: "10px 0 10px 0",
                  textTransform: "none"
                }}
              >
                Red
              </Button>
            </Box>
            {/* Second Row */}
            <Grid
              container
              mt={2}
              sx={{
                backgroundColor: "#232626",
                marginLeft: "auto",
                marginRight: "auto",
                // width: "calc(100% - 20px)",
                width: "100%",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              <Grid item xs={12} mb={1} container justifyContent="space-evenly">
                {[0, 1, 2, 3, 4].map((num) => (
                  <img
                    key={num}
                    src={`/assets/wingo/${num}.webp`}
                    alt={num.toString()}
                    style={{ width: "18%" }}
                    onClick={() => {
                      handleOpenDrawer(num.toString());
                      handleEventSelection(
                        num === 0 ? "mix1" : num % 2 === 1 ? "green" : "red"
                      );
                    }}
                  />
                ))}
              </Grid>
              <Grid item xs={12} container justifyContent="space-evenly">
                {[5, 6, 7, 8, 9].map((num) => (
                  <img
                    key={num}
                    src={`/assets/wingo/${num}.webp`}
                    alt={num.toString()}
                    style={{ width: "18%" }}
                    onClick={() => {
                      handleOpenDrawer(num.toString());
                      handleEventSelection(
                        num === 5 ? "mix2" : num % 2 === 1 ? "green" : "red"
                      );
                    }}
                  />
                ))}
              </Grid>
            </Grid>
            {/* Third Row */}
            <Box
              sx={{
                // width: "calc(100% - 30px)",
                // width: "100%",
                // marginX: "auto",
                display: "flex",
                justifyContent: "center",
                py: 1.5,
                width: "100%"
              }}
            >
              <StyledButtonGroup aria-label="multiplier selection">
                {multipliers.map((multiplier) => (
                  <StyledButton
                    key={multiplier.label}
                    onClick={() => handleMultiplierChange(multiplier)}
                    active={
                      !multiplier.isRandom &&
                        selectedMultiplier === multiplier.value
                        ? 1
                        : 0
                    }
                    isRandom={multiplier.isRandom}
                  >
                    {multiplier.label}
                  </StyledButton>
                ))}
              </StyledButtonGroup>
            </Box>
            {/* Fourth Row */}
            <Box
              // container
              // item
              // xs={12}
              sx={{ display: "flex", justifyContent: "center", width: "100%", mx: "15px" }}
            // justifyContent="center"
            // sx={{ marginBottom: "10px" }}
            >
              <Box sx={{ width: "50%" }}>
                <Button
                  onClick={() => {
                    handleOpenDrawer("big");
                    handleEventSelection("big");
                  }}
                  variant="contained"
                  sx={{
                    width: "100%",
                    borderRadius: "20px 0 0 20px",
                    margin: "0",
                    backgroundColor: "#24ee89",
                    "&:hover": {
                      backgroundColor: "#24ee89",
                    },
                    textTransform: "none"
                  }}
                >
                  Big
                </Button>
              </Box>
              <Box sx={{ width: "50%" }}>
                <Button
                  onClick={() => {
                    handleOpenDrawer("small");
                    handleEventSelection("small");
                  }}
                  variant="contained"
                  sx={{
                    width: "100%",
                    borderRadius: "0 20px 20px 0",
                    margin: "0",
                    backgroundColor: "#5088D3",
                    "&:hover": {
                      backgroundColor: "#5088D3",
                    },
                    textTransform: "none"
                  }}
                >
                  Small
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* bet placed alert */}
<div>
            {/* bet placed alert */}
            {isPopupVisible && (
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  zIndex: 1000,
                  animation: "fadeIn 0.5s ease",
                  textAlign: "center",

                  // Flexbox for centering content
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1">
                  {popupMessage}
                </Typography>
              </Box>
            )}
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            `}</style>
          </div>
          {/* <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
            onClose={handleCloseSnackbar}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
            >
            
              {successMessage}
            </MuiAlert>
          </Snackbar> */}

          {/* Bet placing drawer */}

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "white",
                color: "black",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "white",
                backgroundColor: "#201d2b",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  position: "relative",
                  marginBottom: "-5px",
                  height: "90px",
                  color: "white",
                  backgroundColor: "#201d2b",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: selectedColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
                  }}
                ></div>
                <div style={{ position: "relative", padding: "10px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>{`Win Go ${selectedTimer}`}</Typography>
                  <Typography variant="body1" sx={{ width: "75%", background: "#ffffff", color: "black", borderRadius: "5px" }}>{`${selectedItem} is selected`}</Typography>
                </div>
              </Grid>
              <Grid padding={1} mt={2}>
                <Grid item xs={12}>
                  <Grid container justifyContent="space-between" alignItems={"center"}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ffffff", fontSize: isSmallScreen2 ? "15px" : "17px" }}
                    >
                      Balance
                    </Typography>
                    <Grid sx={{ display: "flex", jusitfyContent: "space-between", gap: "10px" }}>
                      <Button
                        variant="contained"
                        style={

                          activeBetAmount === 1
                            ? {
                              backgroundColor: selectedColor.startsWith(
                                "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                              ) // mix1
                                ? "#d23838"
                                : selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                ) // mix2
                                  ? "#17b15e"
                                  : selectedColor,
                              color: "white",
                              minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                            : {
                              backgroundColor: "#3a4142", color: "#ffffff", minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                        }
                        onClick={() => {
                          handleBetAmount(1);
                          setActiveBetAmount(1);
                        }}
                      >
                        {"₹1"}
                      </Button>

                      <Button
                        variant="contained"
                        style={
                          activeBetAmount === 10
                            ? {
                              backgroundColor: selectedColor.startsWith(
                                "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                              ) // mix1
                                ? "#d23838"
                                : selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                ) // mix2
                                  ? "#17b15e"
                                  : selectedColor,
                              color: "white",
                              minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                            : {
                              backgroundColor: "#3a4142", color: "#ffffff", minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                        }
                        onClick={() => {
                          handleBetAmount(10);
                          setActiveBetAmount(10);
                        }}
                      >
                        {"₹10"}
                      </Button>
                      <Button
                        variant="contained"
                        style={
                          activeBetAmount === 100
                            ? {
                              backgroundColor: selectedColor.startsWith(
                                "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                              ) // mix1
                                ? "#d23838"
                                : selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                ) // mix2
                                  ? "#17b15e"
                                  : selectedColor,
                              color: "white",
                              minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                            : {
                              backgroundColor: "#3a4142", color: "#ffffff", minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                        }
                        onClick={() => {
                          handleBetAmount(100);
                          setActiveBetAmount(100);
                        }}
                      >
                        {"₹100"}
                      </Button>
                      <Button
                        variant="contained"
                        style={
                          activeBetAmount === 1000
                            ? {
                              backgroundColor: selectedColor.startsWith(
                                "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                              ) // mix1
                                ? "#d23838"
                                : selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                ) // mix2
                                  ? "#17b15e"
                                  : selectedColor,
                              color: "white",
                              minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                            : {
                              backgroundColor: "#3a4142", color: "#ffffff", minWidth: "30px",
                              padding: "2px 6px",
                              fontSize: "17px"
                            }
                        }
                        onClick={() => {
                          handleBetAmount(1000);
                          setActiveBetAmount(1000);
                        }}
                      >
                        {"₹1000"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={1}>
                  <Grid container>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                      sx={{ color: "#ffffff", flexWrap: "nowrap" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: isSmallScreen2 ? "12px" : "15px", display: "flex", justifyContent: "flex-start" }}
                      >
                        Add your money
                      </Typography>
                      <Grid item xs="auto" display="flex" justifyContent="flex-end">
                        <TextField
                          placeholder="Add Custom Amount"
                          variant="outlined"
                          value={customBetAmount}
                          onChange={handleCustomBetChange}
                          type="number"
                          sx={{
                            width: isSmallScreen2 ? "70%" : "90%",
                            "& .MuiOutlinedInput-root": {

                              "& fieldset": {
                                border: "1px solid grey", // Normal grey border
                              },
                              "&:hover fieldset": {
                                border: "1px solid grey", // Removes hover effect
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid grey", // Removes focus effect
                              },
                            },
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                          }}
                          style={{
                            borderRadius: 15,
                            height: isSmallScreen2 ? 25 : 30,
                            backgroundColor: "#232626",
                            color: "#ffffff",
                          }}
                          InputProps={{
                            style: {
                              color: "#ffffff",
                              borderRadius: 15,
                              height: isSmallScreen2 ? 25 : 30,
                              fontSize: isSmallScreen2 ? "15px" : "17px",
                            },
                          }}
                          InputLabelProps={{
                            style: { color: "#B3BEC1", fontSize: isSmallScreen2 ? "8px" : "12px", },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                      sx={{ color: "#ffffff" }}>

                      <Typography
                        variant="h6"
                        sx={{ color: "#ffffff", fontSize: isSmallScreen2 ? "15px" : "17px" }}
                      >
                        Quantity
                      </Typography>
                      <Grid
                        item
                        container
                        xs="auto"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item>
                          <IconButton
                            onClick={() =>
                              setMultiplier(
                                multiplier > 1 ? multiplier - 1 : 1
                              )
                            }
                            sx={{
                              color: "white",
                              padding: "4px",
                            }}
                          >
                            <RemoveIcon
                              fontSize="small"
                              sx={{
                                color: selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                                ) // mix1
                                  ? "#d23838"
                                  : selectedColor.startsWith(
                                    "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                  ) // mix2
                                    ? "#17b15e"
                                    : selectedColor,
                                fontSize: 38,
                              }}
                            />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            sx={{
                              // border: `1px solid #3a4142`,
                              borderRadius: "4px",
                              padding: "4px 12px",
                              backgroundColor: "#232626",
                              color: "white",
                              minWidth: "55px",
                              textAlign: "center",
                            }}
                          >
                            {multiplier}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => setMultiplier(multiplier + 1)}
                            sx={{
                              color: "white",
                              padding: "4px",
                            }}
                          >
                            <AddIcon
                              fontSize="small"
                              sx={{
                                color: selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                                ) // mix1
                                  ? "#d23838"
                                  : selectedColor.startsWith(
                                    "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                  ) // mix2
                                    ? "#17b15e"
                                    : selectedColor,
                                fontSize: 38,
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ color: "#ffffff" }}
                  >
                    {[1, 5, 10, 20, 50, 100].map((value) => (
                      <div
                        key={value}
                        className={`button ${activeButton === value ? "active" : ""
                          }`}
                        onClick={() => {
                          handleMultiplier(value);
                          setActiveButton(value);
                        }}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "5px",
                          margin: "5px",
                          ...(activeButton === value
                            ? {
                              backgroundColor: selectedColor.startsWith(
                                "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0"
                              ) // mix1
                                ? "#d23838"
                                : selectedColor.startsWith(
                                  "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                ) // mix2
                                  ? "#17b15e"
                                  : selectedColor,
                              color: "white",
                            }
                            : { backgroundColor: "#3a4142", color: "#ffffff" }),
                        }}
                      >
                        X{value}
                      </div>
                    ))}
                  </Grid>
                  <Typography sx={{ alignItems: "center", display: "flex", mt: 1 }}>
                    <Checkbox
                      checked={agreed}
                      onClick={handleToggle} // Handle both check and uncheck
                      icon={
                        <RadioButtonUncheckedIcon
                          sx={{
                            color: "#c8c9cc", // Unchecked color
                            fontSize: 22, // Adjust size
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckCircleIcon
                          sx={{
                            color: "#24ee89 ", // Checked color
                            fontSize: 22, // Slightly bigger for effect
                          }}
                        />
                      }
                    />
                    <span style={{ marginLeft: 8, fontSize: "13px",color:"#B3BEC1" }}>
                      I agree
                    </span>
                    <span
                      style={{
                        marginLeft: 8,
                        color: "#D23838",
                        fontSize: "13px",
                      }}
                    >
                      《Pre-sale rules》
                    </span>
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={0.5}>
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={4}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{
                        backgroundColor: "#3a4142", color: "#B3BEC1", textTransform: "none",
                        borderRadius: "0px",
                      }}
                      variant="contained"
                      disabled={isPlacingBet}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={8}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      style={{
                        backgroundColor: selectedColor.startsWith(
                          "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0"
                        ) // mix1
                          ? "#d23838"
                          : selectedColor.startsWith(
                            "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                          ) // mix2
                            ? "#17b15e"
                            : selectedColor,
                        color: "#ffffff",
                        textTransform: "none",
                        borderRadius: "0px",
                      }}
                      variant="contained"
                      disabled={!agreed || isPlacingBet}
                    >
                      {`Total amount: ₹${displayBetAmount}`}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

             {/* <>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    background: "rgba(0, 0, 0, 0.8)",
                  }}
                  open={isPlacingBet}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      size={120}
                      sx={{
                        position: "absolute",
                        color: "#F5B73B",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        width: "100%",
                        height: "100%",
                        padding: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        Placing Bet
                      </span>
                    </div>
                  </div>
                </Backdrop>
              </>*/}
            </Grid>
          </Drawer>

          {/* Game history, My history, charts */}

          <Grid
            mt={2}
            container
            justifyContent="center"
            sx={{ marginBottom: "5%" }}
          >
            <Box
              sx={{
                width: "calc(100% - 30px)",
                // maxWidth: "95%",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {tabData.map((tab, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      onClick={() => setActiveTab(index)}
                      sx={{
                        height: "40px", // Adjust this value to change the tab height
                        background:
                          activeTab === index
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#323738",
                        color: activeTab === index ? "black" : "#929292",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        fontWeight: activeTab === index?"bold":"normal"
                        // "&:hover": {
                        //   backgroundColor:
                        //     activeTab === index ? "#0F6518" : "#f5f5f5",
                        // },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "12px", sm: "15px" },
                          textTransform: "none",
                          fontWeight: activeTab === index ? "bold" : "normal"
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2.5 }}>
                {activeTab === 0 && (
                  <TabPanel>
                    <GameHistory
                      data={rows}
                      page={historyPage}
                      setPage={setHistoryPage}
                      totalPage={gameTotalPage}
                    />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <WingoChart data={rows} page={chartPage}
                      setPage={setChartPage}
                      totalPage={gameTotalPage} />
                  </TabPanel>
                )}
                {activeTab === 2 && (
                  <TabPanel>
                    <WingoMyHistory bets={bets} page={betPage}
                      setPage={setBetPage}
                      totalPage={betTotalPage} />
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>

          <>
            {/* ...rest of the code... */}

            {/* Win/Loss popup */}
          <div
              style={{
                display: show ?( open ? "flex" : "none") :"flex", // Toggle visibility based on `open`
                // display: "flex", // Toggle visibility based on `open`
                position: "absolute",
                zIndex: 2000,
                // left: 10,
                top: "0px",
                jusitfyContent: "center",
                alignItems: "center",
                width: isSmallScreen ? "100%" : "calc(100% - 50px)",
                height: "100%",
                overflow: "auto",
                border: "none",
                backgroundColor: "rgba(0, 0, 0, 0.5)"
              }}
            >
              <div
                style={{
                  backgroundColor: "transparent",
                  margin: "5% 15px",
                  // padding: 20,
                  width: "100%",
                  height: "65%",
                  backgroundImage: `url(${popupresult
                    ? gameResult
                      ? "/assets/icons/images/popup-win.webp"
                      : "/assets/icons/images/popup-loss.webp"
                    : "/assets/icons/images/popup-pending.webp"
                    })`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative"
                }}
              >
                <Typography
                  variant="h4"
                  style={{
                    color: gameResult ? "white" : "#7c9dc2",
                    fontWeight: "bold",
                    marginTop: window.innerWidth <= 370 ?"6rem":"7rem",
                    fontSize: "2.1rem",

                  }}
                >
                  {popupresult
                    ? gameResult
                      ? "Congratulations"
                      : "Sorry"
                    : "Pending"}
                </Typography>
                <div style={{ marginTop: "1rem" }}>
                  <LotteryResultsDisplay
                    popupresult={popupresult.split("|")[0]}
                  />
                </div>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: window.innerWidth <= 370 ? "12px" : "14px", mt: window.innerWidth <= 370 ? 2 : 3, mb: window.innerWidth <= 370 ? 2 : 3 }}
                >
                  {/* {dialogContent} */}
                  <br />
                  <span
                    style={{
                      color: gameResult ? "green" : "red",
                      fontWeight: "bold",
                      fontSize: window.innerWidth <= 370 ? "15px" : "17px"
                    }}
                  >
                    {gameResult ? `+₹` + parseFloat(winloss).toFixed(2) : `-₹` + parseFloat(winloss).toFixed(2)}
                  </span>

                  <br />
                  <span style={{ fontSize: window.innerWidth <= 370 ? "11px" : "14px", fontWeight: "bold" }}>
                    Period: Win {getOriginalKey(popupTimer)}
                  </span>
                  <br />
                  <span style={{ fontSize: window.innerWidth <= 370 ? "11px" : "14px", fontWeight: "bold" }}>
                    {popupperiodid}
                  </span>
                </Typography>
                <Typography sx={{ color: gameResult ? "white" : "#7c9dc2", mt: 3,display:"flex",alignItems:"center",flexDirection:"row" }}>
                  <Checkbox
                      checked={show}
                      onClick={handleToggle2} // Handle both check and uncheck
                      icon={
                        <RadioButtonUncheckedIcon
                          sx={{
                            color: gameResult ? "white" : "#7c9dc2", // Unchecked color
                            fontSize: 22, // Adjust size
                           
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckCircleIcon
                          sx={{
                            color: gameResult ? "white" : "#7c9dc2", // Checked color
                            fontSize: 22, // Slightly bigger for effect
                            
                            borderRadius: "50px"
                          }}
                        />
                      }
                    />
                    After 3 seconds auto close
                </Typography>
                <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", bottom: -60 }}>
                  <CancelOutlinedIcon
                    sx={{ color: "white", fontSize: "45px" }}
                  />
                </IconButton>
              </div>
            </div>
          </>
        </div>
        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
        <br />
        <br />
        <br />
      </Mobile>
    </>
  );
};

export default WingoPage;
