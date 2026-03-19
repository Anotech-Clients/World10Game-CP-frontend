import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import useAuth to access axiosInstance and token
// import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token
import NeedToDepositModal from "../common/NeedToDepositModal"; // Import the new modal

const Lottery = () => {
  const navigate = useNavigate();
  const { axiosInstance } = useAuth(); // Get axiosInstance from AuthContext
  const [openDepositModal, setOpenDepositModal] = useState(false); // State for deposit modal
  const [selectedGame, setSelectedGame] = useState(null);
  const [firstDepositMade, setFirstDepositMade] = useState(false);
  const [needToDepositMode, setNeedToDepositMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const Lottery = [
    {
      id: 1,
      imgSrc: "/assets/lottery/wingo.webp",
      game: "Win Go",
      path: "/timer",
    },
    {
      id: 2,
      imgSrc: "/assets/lottery/K3Lottery.webp",
      game: "k3",
      path: "/k3",
    },
    {
      id: 3,
      imgSrc: "/assets/lottery/5dLottery.webp",
      game: "5d",
      path: "/5d",
    },
    // {
    //   id: 4,
    //   imgSrc: "/assets/lottery/car.webp",
    //   game: "5d",
    //   path: "/car-race",
    // },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user data from the /api/user/me endpoint
        const userResponse = await axiosInstance.get("/api/user/me");
        //console.log("User data response:", userResponse.data);

        if (userResponse.data.success && userResponse.data.body.user) {
          const userData = userResponse.data.body.user;
          setUserData(userData);

          // Set the firstDepositMade state based on the isFirstDepositMode field
          setFirstDepositMade(userData.isFirstDepositMode === true);
          //console.log("First deposit made:", userData.isFirstDepositMode);
        }

        // Fetch needToDepositMode from the API
        const depositModeResponse = await axiosInstance.get("/api/additional/need-to-deposit/mode");
        const { needToDepositMode } = depositModeResponse.data;
        setNeedToDepositMode(needToDepositMode);
        //console.log("Need to deposit mode:", needToDepositMode);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [axiosInstance]);

  const handleGameClick = (game) => {
    if (needToDepositMode && !firstDepositMade) {
      setSelectedGame(game);
      setOpenDepositModal(true); // Open the deposit modal
    } else {
      navigate(game.path);
    }
  };

  const handleCloseDepositModal = () => {
    setOpenDepositModal(false); // Close the deposit modal
  };

  const handleConfirmDeposit = () => {
    navigate("/wallet/deposit"); // Navigate to deposit page
  };

  // const handleNext = () => {
  //   const container = document.querySelector(".games-container");
  //   if (container) {
  //     container.scrollLeft += container.offsetWidth;
  //   }
  // };

  // const handlePrev = () => {
  //   const container = document.querySelector(".games-container");
  //   if (container) {
  //     container.scrollLeft -= container.offsetWidth;
  //   }
  // };

  return (
    <>
      <Box sx={{ mt: 0 }}>
        <Grid
          container
          alignItems="center"
          sx={{
            mt: 0,
            mb: 0,
            display: "flex",
            flexWrap: "nowrap",
            width: "100%",
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {/* <img src="/assets/gameFilter/lottery.webp" alt="" width="21px" /> */}
          <Grid
            item
            sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                color: "#ffffff",
                marginRight: "6px",
                marginLeft: "6.5px",
                whiteSpace: "nowrap",
                textAlign:"left",
                fontWeight:"bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Lottery
            </Typography>
            {/* <Typography sx={{ fontSize: "12px", textAlign: "left", color: "#a7a19a" , marginLeft: "6.5px",}}>
              Fair and diverse lottery gameplay
            </Typography> */}
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography>Loading games...</Typography>
          </Box>
        ) : (
        <Box
          className="games-container"
          sx={{
            flexGrow: 1,
            maxWidth: 600,
            margin: "auto",
            padding: 0,
            overflowX: "hidden",
          }}
        >
          <Box sx={{ paddingTop: "10px" }}>
            <Grid container spacing={0.8}>
              {Lottery.map((game) => (
                <Grid item xs={6} key={game.id}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleGameClick(game)}
                  >
                    <Box
                      component="img"
                      src={game.imgSrc}
                      alt={game.game}
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
         )}
      </Box>

      {/* NeedToDepositModal */}
      <NeedToDepositModal
        open={openDepositModal}
        onClose={handleCloseDepositModal}
        onConfirm={handleConfirmDeposit}
      />
    </>
  );
};

export default Lottery;