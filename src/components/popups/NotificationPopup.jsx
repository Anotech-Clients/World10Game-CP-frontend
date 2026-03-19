import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const NotificationModal = ({ open, onClose }) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const lastConfirmedDate = localStorage.getItem("notificationConfirmedDate");
    const today = new Date().toDateString();

    if (lastConfirmedDate === today) {
      setShouldShow(false);
    } else {
      setShouldShow(true);
    }
  }, [open]);

  const handleConfirm = () => {
    const today = new Date().toDateString();
    localStorage.setItem("notificationConfirmedDate", today);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
      onClose={(event, reason) => {
        // Only close if the close button is clicked, not on backdrop click
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "313px",
          maxHeight: "450px",
          bgcolor: "#232626",
          borderRadius: "15px",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(90deg,#24ee89,#9fe871)",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            p: 1,
            color: "#ffffff",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "19.2px", textAlign: "center", fontWeight: "bold" }}
          >
            WELCOME TEXT
          </Typography>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff",mt:1.5 }}
          >
            ✅ <span style={{ color: "#FF9C00" }}>WELCOME TO World 10 Game</span> ✅
            CLAIM <span style={{ color: "#FF9C00" }}>1%</span> BUY AND SELL ARB TOKEN ON <span style={{ color: "#FF9C00" }}>AR WALLET</span><br />【 <span style={{ color: "#FF9C00" }}>MORE</span> 】
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            CLAIM <span style={{ color: "#FF9C00" }}>₹3888</span> Daily Recharge BONUS 【 <span style={{ color: "#FF9C00" }}>GO</span> 】
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", fontSize: "16px", color: "#ffffff" }}>
            WinGo betting Rankings Online!
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", fontSize: "16px", color: "#FF9C00" }}>
            🥇First place win ₹388,888🥇
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", fontSize: "16px", color: "#FF9C00" }}>
            🥈Second place win ₹188,888🥈
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", fontSize: "16px", color: "#FF9C00" }}>
            🥉Third place win ₹88,888🥉
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            <span style={{ color: "#FF9C00" }}>1000</span> winners share ₹<span style={{ color: "#FF9C00" }}>1,000,000 </span>prize pool!
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            ✅ World 10 Game Customer Services【<span style={{ color: "#FF9C00" }}>Telegram </span>】✅
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            🛡️ Verify True World 10 Game Site <br />【<span style={{ color: "#FF9C00" }}>GO </span>】🛡️
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            ❌Never Send Money To Anyone Claiming To Be An Agent❌
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "800", textAlign: "center", mb: 2, fontSize: "16px", color: "#ffffff" }}>
            ❌Do Not Share Proof Of Payments, UTR Number or OTP Code❌
          </Typography>

        </Box>

        {/* Confirm Button */}
        <Box
          sx={{
            textAlign: "center",
            p: 0.8,
            background: "#232626",
            // background: "linear-gradient(90deg,#24ee89,#9fe871),#111111",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
              color: "#ffffff",
              borderRadius:"20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "linear-gradient(90deg,#24ee89,#9fe871)",
                boxShadow: "none",
              },
              fontSize:"16px",
              p:"5px 30px",
              mb:1
            }}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotificationModal;