import React, { useContext, useEffect, useState } from "react";
import Mobile from "../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import BottomNavigationArea from "../components/common/BottomNavigation";
import { domain } from "../utils/Secret";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { UserContext } from "../context/UserState"
import LoadingLogo from "../components/utils/LodingLogo";

const Wallet = ({ children }) => {
  const [dwInfo, setDwInfo] = useState({
    totalDeposit: 0,
    totalWithdrawal: 0,
    balance: 0
  });
  const [thirdPartyWalletBalance, setThirdPartyWalletBalance] = useState(0);
  const [getThirdPartyBalance, setGetThirdPartyBalance] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { axiosInstance } = useAuth();
  const navigate = useNavigate();
  const { userWallet, getWalletBalance, userData } = useContext(UserContext);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const mainWalletBalance = userWallet ? userWallet : 0;
  const progressMainWallet = Math.min((mainWalletBalance / dwInfo.totalDeposit) * 100, 100);
  const progressThirdPartyWallet = Math.min((getThirdPartyBalance / dwInfo.totalDeposit) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  // Fetch wallet balance and DW info when component mounts
  useEffect(() => {
    getWalletBalance();
    fetchDwInfo();
  }, []);

  // Fetch deposit and withdrawal information
  const fetchDwInfo = async () => {
    try {
      if (userData?.uid) {
        const response = await axiosInstance.get(`${domain}/api/wallet/common/dw-info`, {
          withCredentials: true,
        });
        
        if (response.data.success) {
          setDwInfo({
            totalDeposit: response.data.data.totalDeposit || 0,
            totalWithdrawal: response.data.data.totalWithdrawal || 0,
            balance: response.data.data.balance || 0
          });
        }
      }
    } catch (err) {
      console.error("Error fetching deposit/withdrawal info:", err);
    }
  };

  const fetchThirdPartyBalance = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/api-wrapper/get-wallet-balance`, {
        withCredentials: true,
      });
      setGetThirdPartyBalance(response.data.ThirdPartyWalletAmount);
    } catch (err) {
      console.error("Error fetching third-party wallet balance:", err);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchThirdPartyBalance();
  }, []);

  // Handle wallet transfer
  const handleTransfer = async () => {
    if (!userData?.uid || loading) return;

    setLoading(true);

    try {
      await fetchThirdPartyBalance();

      if (getThirdPartyBalance <= 0) {
        console.error("Insufficient balance for transfer.");
        setLoading(false);
        return;
      }

      const transferResponse = await axiosInstance.post(
        `${domain}/api/api-wrapper/wallet-transfer`,
        {
          uid: userData.uid,
          amount: getThirdPartyBalance,
        },
        { withCredentials: true }
      );

      if (transferResponse.data.success) {
        await getWalletBalance();
        await fetchThirdPartyBalance();
        await fetchDwInfo(); // Refresh deposit/withdrawal info after transfer

        //console.log("Wallet transfer successful:", transferResponse.data);
      } else {
        console.error("Wallet transfer failed:", transferResponse.data.message);
      }
    } catch (err) {
      console.error("Error during wallet transfer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log("loading", loading);
  }, [loading]);

  const data = [
    {
      label: "Lottery",
      value: `${userWallet || 0}`,
      bgImage: "/assets/betHistory/WM_Video.webp"
    },
    {
      label: "CQ9",
      value: 0.0,
      bgImage: "/assets/betHistory/CQ9.webp"
    },
    {
      label: "MG",
      value: 0.0,
      bgImage: "/assets/betHistory/MG_Video.webp"
    },
    {
      label: "JDB",
      value: 0.0,
      bgImage: "/assets/betHistory/JDB.webp"
    },
    {
      label: "EVO_Video",
      value: 0.0,
      bgImage: "/assets/betHistory/EVO_Video.webp"
    },
    {
      label: "JILI",
      value: 0.0,
      bgImage: "/assets/betHistory/Jili.webp"
    },
    {
      label: "V8Card",
      value: 0.0,
      bgImage: "/assets/betHistory/V8CARD.webp"
    },
    {
      label: "DG",
      value: 0.0,
      bgImage: "/assets/betHistory/DG.webp"
    },
    {
      label: "WM_Video",
      value: 0.0,
      bgImage: "/assets/betHistory/WM_Video.webp"
    },
    {
      label: "Card365",
      value: 0.0,
      bgImage: "assets/betHistory/CARD365.webp"
    },
    {
      label: "SEXY_Video",
      value: 0.0,
      bgImage: "/assets/betHistory/SEXY_Video.webp"
    },
  ];

  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="100dvh"
          position="relative"
        >
          {/* Loading Overlay */}
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
          <Box flexGrow={1} sx={{ backgroundColor: "#232626" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "7px 12px",
              }}
            >
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  sx={{
                    color: "#F5F3F0",
                    position: "absolute",
                    left: 0,
                    p: "12px",
                  }}
                  onClick={handleRedirect}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ color: "#F5F3F0", textAlign: "center", fontSize: "19px" }}
                >
                  Wallet
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              sx={{
                background: "#323738",
                height: "11rem",
                padding: "0px",
              }}
            >
              {/* Image Section */}
              <Grid item xs={12} display="flex" justifyContent="center" mt={1} flexDirection={"column"}>
                <Grid >
                  <img
                    src="/assets/icons/wallet.svg"
                    alt="Placeholder"
                    width={38}
                    height={38}
                  />
                </Grid>

                {/* Wallet Amount Section */}
                <Grid
                  item
                  xs={12}
                  textAlign="center"
                  sx={{
                    marginTop: "0px",
                  }}
                >
                  <Typography
                    color={"white"}
                    sx={{ fontSize: "25.6px" }}
                  >{`\u20B9${userWallet ? userWallet : " Loading"
                    }`}</Typography>
                  <Typography color={"white"} sx={{ fontSize: "13.5px" ,fontFamily: "'Times New Roman', Times,  ",}}>
                    Total balance
                  </Typography>
                </Grid>
              </Grid>
              {/* Total Amount and Total Deposit Sections */}
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                  color: "white",
                  width: "fit-content",
                  margin: "0 auto",
                  paddingBottom: "10px"
                }}
              >
                <Grid sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "17px" }}>
                    {`\u20B9${dwInfo.totalWithdrawal}`}
                  </Typography>
                  <Typography sx={{ fontSize: "13px",}}>Total withdrawal amount</Typography>
                </Grid>
                <Grid sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "17px" }}>
                    {`\u20B9${dwInfo.totalDeposit}`}
                  </Typography>
                  <Typography sx={{ fontSize: "13px" ,}}>Total deposit amount</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              mt={2}
              sx={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginLeft: "auto",
                marginRight: "auto",
                width: " calc(100% - 30px)",
                backgroundColor: "#323738",
                borderRadius: "20px",
              }}
            >
              {/* First Grid */}
              <Grid item xs={6} mt={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    sx={{ color: "#3a4142" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={progressMainWallet?progressMainWallet:0}
                    size={80}
                    sx={{ color: "#fde4bc", position: "absolute" }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ color: "#fde4bc", fontWeight: "bold" }}
                    >
                      {`${Math.round(progressMainWallet?progressMainWallet:0)}%`}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ color: "#fde4bc", fontSize: "1rem",fontFamily: "'Times New Roman', Times,  ", }}
                >{`\u20B9${userWallet ? userWallet : "Loading..."
                  }`}</Typography>
                <Typography sx={{ color: "#fde4bc", fontSize: "0.9rem",fontFamily: "'Times New Roman', Times,  ", }}>
                  Main wallet
                </Typography>
              </Grid>
              <Grid item xs={6} mt={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    sx={{ color: "#3a4142" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={progressThirdPartyWallet?progressThirdPartyWallet:0}
                    size={80}
                    sx={{ color: "#fde4bc", position: "absolute" }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ color: "#fde4bc", fontWeight: "bold" }}
                    >
                      {`${Math.round(progressThirdPartyWallet?progressThirdPartyWallet:0)}%`}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{ color: "#fde4bc", fontSize: "1rem",fontFamily: "'Times New Roman', Times,  ", }}
                  >{`₹${getThirdPartyBalance? getThirdPartyBalance: "Loading..."}`}</Typography>
                <Typography sx={{ color: "#fde4bc", fontSize: "0.9rem",fontFamily: "'Times New Roman', Times,  ",}}>
                  3rd party wallet
                </Typography>
              </Grid>
              {/* Second Grid */}
              <Grid item xs={12} mt={2}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg,#24ee89,#9fe871)",
                    borderRadius: "20px",
                    width: "95%",
                    fontWeight: "bold",
                    textTransform: "initial",
                    color:"#232626"
                  }}
                  fullWidth
                  onClick={handleTransfer}
                  disabled={getThirdPartyBalance <= 0 || loading}
                >
                  {loading ? "Processing..." : "Main wallet transfer"}
                </Button>
              </Grid>
              {/* Third Grid */}
              <Grid container item xs={12} spacing={1} mt={1} mb={1}>
                <Grid item xs={3} onClick={() => navigate("/wallet/deposit")}>
                  <img
                    src="/assets/icons/deposit.webp"
                    alt="1"
                    width={55}
                    height={55}
                  />
                  <Typography sx={{ color: "#B3BEC1", fontSize: "0.8rem" ,fontFamily: "'Times New Roman', Times,  ",}}>

                    Deposit{" "}
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/wallet/withdraw")}>
                  <img
                    src="/assets/icons/withdraw.webp"
                    alt="2"
                    width={55}
                    height={55}
                  />
                  <Typography sx={{ color: "#B3BEC1", fontSize: "0.8rem" ,fontFamily: "'Times New Roman', Times,  ",}}>
                    Withdraw
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/deposit-history")}>
                  <img
                    src="/assets/icons/deposithistory.webp"
                    alt=" 3"
                     width={55}
                    height={55}
                  />
                  <Typography sx={{ color: "#B3BEC1", fontSize: "0.8rem",fontFamily: "'Times New Roman', Times,  ", }}>
                    Deposit history
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/withdraw-history")}>
                  <img
                    src="/assets/icons/withdrawhistory.webp"
                    alt="4"
                     width={55}
                    height={55}
                  />
                  <Typography sx={{ color: "#B3BEC1", fontSize: "0.8rem",fontFamily: "'Times New Roman', Times,  ", }}>
                    Withdrawal History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ p: 2, borderRadius: 1, marginBottom: "100px" }}>
              <Grid container spacing={1.5}>
                {data.map((item, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: '90px',
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#323738',
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80px',
                          height: '80px',
                          backgroundImage: `url(${item.bgImage})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          filter: 'brightness(20%)',
                          zIndex: 0,
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#a8a5a1",
                          fontWeight: 'bold',
                          fontSize: "12.8px",
                          mb: 0.5,
                          position: 'relative'
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#626663",
                          fontSize: "12px",
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          position: 'relative',
                          fontWeight: "bold"
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {children}
        </Box>
        <BottomNavigationArea />
      </Mobile>
    </div>
  );
};

export default Wallet;