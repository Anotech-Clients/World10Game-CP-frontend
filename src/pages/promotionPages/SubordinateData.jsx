import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Tab } from "@mui/material";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import DatePickerHeader from "../../components/common/DatePickerHeader";
import DatePickerBody from "../../components/common/DatePickerBody";
import LevelHeader from "../../components/common/LevelHeader";
import LevelBody from "../../components/common/LevelBody";
import { domain } from "../../utils/Secret";
import Divider from "@mui/material/Divider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LoadingLogo from "../../components/utils/LodingLogo";
import { useAuth } from "../../context/AuthContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1,
  );
};

const toLocalDateString = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatGameType = (commission) => {
  if (commission.commissionType === "DEPOSIT") return "Deposit";
  switch (commission.gameType) {
    case "WINGO":
      return "Wingo";
    case "K3":
      return "K3";
    case "FIVED":
      return "Fived";
    case "CAR_RACE":
      return "Car Race";
    case "API_GAME":
      return commission.apiGameName || "API Game";
    case "NA":
      return "Deposit";
    default:
      return commission.gameType || "—";
  }
};

// Yesterday = 1 day ago (activity date; commission credited at 12:01 AM next day)
const getDefaultActivityDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateString(d);
};

const getDefaultActivityDateObj = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const SubordinateData = () => {
  const today = new Date();
  const defaultDateObj = getDefaultActivityDateObj();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(getDefaultActivityDate());
  const [user, setUser] = useState(null);
  const [commissionHistory, setCommissionHistory] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [levelDrawerOpen, setLevelDrawerOpen] = useState(false);
  const [year, setYear] = useState(defaultDateObj.getFullYear());
  const [month, setMonth] = useState(defaultDateObj.getMonth() + 1);
  const [day, setDay] = useState(defaultDateObj.getDate());
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchLevel, setSearchLevel] = useState("All");
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(2023, 1));
  // const [subordinateDataSummary, setSubordinateDataSummary] = useState([]);
  // const [filteredSummary, setFilteredSummary] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [summaryStats, setSummaryStats] = useState({
    depositNumber: 0,
    depositAmount: 0,
    bettorsCount: 0,
    totalBetAmount: 0,
    firstDepositCount: 0,
    firstDepositAmount: 0,
  });
  // const [subordinateTurnOver, setSubordinateTurnOver] = useState({});
  const { axiosInstance } = useAuth();

  const [subordinatePage, setSubordinatePage] = useState(1);
  const [commissionPage, setCommissionPage] = useState(1);
  const [subordinatePagination, setSubordinatePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [commissionPagination, setCommissionPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(year, month));
    const maxDay = getDaysInMonth(year, month).length;
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [year, month]);

  const fetchData = async (date, subPage = 1, commPage = 1) => {
    if (!date) return;

    setIsLoading(true);

    try {
      const pageToSend = tabValue === 0 ? subPage : commPage;
      const [subordinateResult, analysisResult] = await Promise.allSettled([
        axiosInstance.get(`${domain}/api/promotion/subordinate-details-data`, {
          params: {
            startDate: date,
            subordinatePage: subPage,
            commissionPage: commPage,
            _t: Date.now(),
            ...(searchLevel !== "All" ? { level: searchLevel } : {}),
            ...(searchTerm.trim()
              ? { searchSubordinateUid: searchTerm.trim() }
              : {}),
          },
          withCredentials: true,
        }),
        axiosInstance.get(`${domain}/api/subordinate/analysis`, {
          params: {
            timeFilter: "custom",
            customDate: date,
            _t: Date.now(),
            ...(searchLevel !== "All" ? { level: searchLevel } : {}),
          },
          withCredentials: true,
        }),
      ]);

      const subordinateResponse =
        subordinateResult.status === "fulfilled"
          ? subordinateResult.value
          : null;
      const analysisResponse =
        analysisResult.status === "fulfilled" ? analysisResult.value : null;

      if (subordinateResponse?.data?.data) {
        setUser(subordinateResponse.data.data.subordinates?.data ?? []);
        setCommissionHistory(
          subordinateResponse.data.data.commissionDetails?.data ?? [],
        );
        setSubordinatePagination(
          subordinateResponse.data.data.subordinates?.pagination ?? {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          },
        );
        setCommissionPagination(
          subordinateResponse.data.data.commissionDetails?.pagination ?? {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          },
        );
      }

      if (analysisResponse?.data?.data) {
        const data = analysisResponse.data.data;
        // API returns level-specific data: Level 1 in direct*, Level 2-6 in indirect*, All = both
        const depositNum =
          (data.filteredDirectDeposits ?? 0) +
          (data.filteredIndirectDeposits ?? 0);
        const depositAmt =
          (data.filteredDirectDepositAmount ?? 0) +
          (data.filteredIndirectDepositAmount ?? 0);
        const bettors =
          (data.filteredDirectBettors ?? 0) +
          (data.filteredIndirectBettors ?? 0);
        const betAmt =
          (data.filteredDirectBetAmount ?? 0) +
          (data.filteredIndirectBetAmount ?? 0);
        const firstDepCount =
          (data.filteredDirectFirstDeposits ?? 0) +
          (data.filteredIndirectFirstDeposits ?? 0);
        const firstDepAmt =
          (data.filteredDirectFirstDepositAmount ?? 0) +
          (data.filteredIndirectFirstDepositAmount ?? 0);
        setSummaryStats({
          depositNumber: depositNum,
          depositAmount: depositAmt,
          bettorsCount: bettors,
          totalBetAmount: betAmt,
          firstDepositCount: firstDepCount,
          firstDepositAmount: firstDepAmt,
        });
      } else {
        setSummaryStats({
          depositNumber: 0,
          depositAmount: 0,
          bettorsCount: 0,
          totalBetAmount: 0,
          firstDepositCount: 0,
          firstDepositAmount: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", {
        message: error.message,
        response: error.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchDate, subordinatePage, commissionPage);
  }, [tabValue, subordinatePage, commissionPage]);

  // Fetch only when date or CONFIRMED level changes (not when scrolling in tier picker)
  useEffect(() => {
    setSubordinatePage(1);
    setCommissionPage(1);
    fetchData(searchDate, 1, 1);
  }, [searchDate, searchLevel]);

  // Search by UID: trigger fetch on button click or Enter (searchTerm not in deps to avoid fetch on every keystroke)
  const handleSearch = () => {
    setSubordinatePage(1);
    setCommissionPage(1);
    fetchData(searchDate, 1, 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = () => {
    setSearchDate(toLocalDateString(new Date(year, month - 1, day)));
    setDatePickerOpen(false);
  };

  const handleLevelConfirm = () => {
    setSearchLevel(selectedLevel === "All" ? "All" : selectedLevel.toString());
    setLevelDrawerOpen(false);
  };

  const handleSubordinatePageChange = (event, value) => {
    setSubordinatePage(value);
  };

  const handleCommissionPageChange = (event, value) => {
    setCommissionPage(value);
  };

  const handleCopyUserId = (userId) => {
    navigator.clipboard.writeText(userId.toString());
  };

  const PaginationControls = ({ currentPage, totalPages, onChange }) => {
    return totalPages > 1 ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onChange}
          shape="rounded"
          size="medium"
          siblingCount={isSmallScreen ? 0 : 1}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: NavigateBeforeIcon, next: NavigateNextIcon }}
              {...item}
              sx={{
                color: 'white',
                '&.Mui-selected': {
                  backgroundColor: '#24ee89',
                  color: 'black',
                },
                '&.MuiPaginationItem-root': {
                  margin: '0 2px',
                },
              }}
            />
          )}
        />
      </Box>
    ) : null;
  };

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          position="relative"
          backgroundColor="#232626"
        >
          <Box flexGrow={1}>
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
                    color: "#ffffff",
                    position: "absolute",
                    left: 0,
                    p: "12px",
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                >
                  Subordinate Data
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ px: "16px", pt: "15px" }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#323738",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search subordinate UID"
                    style={{
                      flexGrow: 1,
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#ffffff",
                      outline: "none",
                      padding: "10px",
                      fontSize: "16px",
                    }}
                  />
                  <IconButton
                    onClick={handleSearch}
                    sx={{
                      background: "#24ee89",
                      padding: "0px 16px",
                      borderRadius: "50px",
                      "&:hover": {
                        background: "#24ee89",
                      },
                    }}
                  >
                    <SearchIcon style={{ color: "black", fontSize: "32px" }} />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedLevel(
                      searchLevel === "All" ? "All" : searchLevel.toString(),
                    );
                    setLevelDrawerOpen(true);
                  }}
                  sx={{
                    width: "48%",
                    height: "2.8rem",
                    backgroundColor: "#323738",
                    textTransform: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    borderColor: "transparent",
                    color: "#ffffff",
                    borderRadius: "5px",
                  }}
                >
                  {searchLevel === "All"
                    ? "All Levels"
                    : `Level ${searchLevel}`}
                  <KeyboardArrowDownOutlinedIcon sx={{ color: "#B3BEC1" }} />
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    width: "48%",
                    height: "2.8rem",
                    backgroundColor: "#323738",
                    textTransform: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    borderColor: "transparent",
                    color: "#ffffff",
                    borderRadius: "5px",
                  }}
                  onClick={() => setDatePickerOpen(true)}
                >
                  {searchDate || "Choose Date"}
                  <KeyboardArrowDownOutlinedIcon sx={{ color: "#B3BEC1" }} />
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" alignItems="center">
              <Box
                sx={{
                  padding: "15px 10px",
                  backgroundColor: "#3a4142",
                  width: "88%",
                  borderRadius: "10px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  color: "white",
                }}
              >
                <Grid container spacing={2}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#ffffff"
                          sx={{ borderRight: "1px solid #626663" }}
                        >
                          {summaryStats.depositNumber}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            borderRight: "1px solid #626663",
                            color: "#B3BEC1"
                          }}
                        >
                          Deposit number
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center", }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#ffffff"
                        >
                          {summaryStats.depositAmount.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#ffffff" }}
                        >
                          Deposit amount
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            borderRight: "1px solid #626663",
                            color: "#ffffff",
                          }}
                        >
                          {summaryStats.bettorsCount}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            borderRight: "1px solid #626663",
                            color: "#ffffff",
                          }}
                        >
                          Number of bettors
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#ffffff"
                        >
                          {summaryStats.totalBetAmount.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#ffffff" }}
                        >
                          Total bet
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            borderRight: "1px solid #626663",
                            color: "#ffffff",
                          }}
                        >
                          {summaryStats.firstDepositCount}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            borderRight: "1px solid #626663",
                            color: "#ffffff",
                          }}
                        >
                          Number of people making first deposit
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#ffffff"
                        >
                          {summaryStats.firstDepositAmount.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#B3BEC1" }}
                        >
                          First deposit amount
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Box
              sx={{
                width: "92%",
                margin: "12px auto",
                backgroundColor: "#24ee89",
                borderRadius: "25px",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="fullWidth"
                sx={{
                  backgroundColor: "#3a4142",
                  borderRadius: "5px",
                  color: "#ffffff",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#ffffff",
                  },
                }}
              >
                <Tab
                  label="Subordinate Details"
                  sx={{
                    borderBottom: tabValue === 0 ? "1px solid #3D363A" : "none",
                    textTransform: "initial",
                  }}
                />
                <Tab
                  label="Commission Details"
                  sx={{
                    borderBottom: tabValue === 1 ? "1px solid #3D363A" : "none",
                    textTransform: "initial",
                  }}
                />
              </Tabs>
              <Box sx={{ padding: "1px", backgroundColor: "#323738" }}>
                {tabValue === 0 && <div></div>}
                {tabValue === 1 && <div></div>}
              </Box>
            </Box>

            <Box sx={{ backgroundColor: "#232626", px: "16px", borderRadius: "5px", }}>
              {isLoading ? (
                <Box sx={{ color: '#B3BEC1', display: 'flex', justifyContent: 'center', py: 4 }}>
                  Loading ...
                </Box>
              ) : tabValue === 0 ? (
                !user || user.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src="/assets/No data-1.webp"
                      alt="No Data Available"
                      style={{ width: "200px", height: "auto" }}
                    />
                    <Typography
                      variant="h7"
                      color="#B3BEC1"
                      sx={{ marginTop: "16px" }}
                    >
                      No Data Available
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#232626",
                          borderRadius: "5px",
                          paddingBottom: "10px",
                          width: "100%",
                          maxWidth: "600px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                            padding: "12px",
                            borderRadius: "5px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "start",
                              color: "#ffffff",
                            }}
                          >
                            UID
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#ffffff",
                            }}
                          >
                            Joined
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#ffffff",
                              textAlign: "center",
                            }}
                          >
                            Commission
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#ffffff",
                              textAlign: "end",
                            }}
                          >
                            Level
                          </Typography>
                        </Box>

                        <Divider
                          sx={{
                            borderColor: "#3D363A",
                            borderWidth: "1px",
                            marginBottom: "16px",
                          }}
                        />

                        {user?.map((data, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 2fr 1fr 1fr",
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#323738",
                              borderRadius: "8px",
                              marginBottom:
                                index !== user.length - 1 ? "8px" : "0",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                              }}
                            >
                              {data.userId}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                ml: 4,
                              }}
                            >
                              {new Date(data.joiningDate).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "center",
                              }}
                            >
                              {data.totalCommission !== undefined
                                ? data.totalCommission
                                : 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "end",
                              }}
                            >
                              {data.level}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <PaginationControls
                      currentPage={subordinatePage}
                      totalPages={subordinatePagination.totalPages}
                      onChange={handleSubordinatePageChange}
                    />
                  </>
                )
              ) : !commissionHistory || commissionHistory.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="/assets/No data-1.webp"
                    alt="No Data Available"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <Typography
                    variant="h7"
                    color="#B3BEC1"
                    sx={{ marginTop: "16px" }}
                  >
                    No Data Available
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      backgroundColor: "#232626",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    {commissionHistory.map((commission, index) => (
                      <Card
                        key={index}
                        sx={{
                          backgroundColor: "#323738",
                          borderRadius: "5px",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          maxWidth: "400px",
                          border: "none",
                          height: "auto",
                          pb: "10px",
                          pt: "4px",
                        }}
                      >
                        <CardContent
                          sx={{
                            p: "6px",
                            paddingBottom: "0 !important",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "4px",
                              gap: "8px",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: "#ffffff",
                                fontWeight: "bold",
                              }}
                            >
                              UID: {commission.userId}
                            </Typography>
                            <IconButton
                              sx={{
                                padding: "0",
                                color: "#ffffff",
                              }}
                              onClick={() => handleCopyUserId(commission.userId)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Divider sx={{ marginBottom: "6px", borderColor: "#3D363A" }} />

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto",
                              gap: "4px 10px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "start",
                              }}
                            >
                              Level:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "end",
                              }}
                            >
                              {commission.level}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "start",
                              }}
                            >
                              Deposit amount:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#24ee89",
                                textAlign: "end",
                              }}
                            >
                              {commission.actualAmount}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "start",
                              }}
                            >
                              Bet amount:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#24ee89",
                                textAlign: "end",
                              }}
                            >
                              {commission.gameType === "WINGO" ? "Wingo" : commission.gameType}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "start",
                              }}
                            >
                              Commission:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#24ee89",
                                textAlign: "end",
                              }}
                            >
                              {commission.amount.toFixed(2)}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#B3BEC1",
                                textAlign: "start",
                              }}
                            >
                              Time:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#b3bec1",
                                textAlign: "end",
                              }}
                            >
                              {new Date(commission.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  <PaginationControls
                    currentPage={commissionPage}
                    totalPages={commissionPagination.totalPages}
                    onChange={handleCommissionPageChange}
                  />
                </>
              )}
            </Box>
          </Box>
          <br />
          <br />
          <br />
        </Box>
      </Mobile>

      <Drawer
        anchor="bottom"
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "auto",
            margin: "0 auto",
            maxWidth: isSmallScreen ? "600px" : "396px",
            color: "white",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
            padding: "0",
            backgroundColor: "#323738",
          },
        }}
      >
        <DatePickerHeader
          onCancel={() => setDatePickerOpen(false)}
          onConfirm={handleDateChange}
        />
        <DatePickerBody
          year={year}
          month={month}
          day={day}
          daysInMonth={daysInMonth}
          setYear={setYear}
          setMonth={setMonth}
          setDay={setDay}
          maxDayOffset={-1}
        />
      </Drawer>

      <Drawer
        anchor="bottom"
        open={levelDrawerOpen}
        onClose={() => setLevelDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "auto",
            margin: "0 auto",
            maxWidth: isSmallScreen ? "600px" : "396px",
            backgroundColor: "#323738",
            color: "#a8a5a1",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          },
        }}
      >
        <LevelHeader
          onCancel={() => setLevelDrawerOpen(false)}
          onConfirm={handleLevelConfirm}
        />
        <LevelBody
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          options={[
            "Dummy",
            "All",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
          ]}
        />
      </Drawer>
    </>
  );
};

export default SubordinateData;