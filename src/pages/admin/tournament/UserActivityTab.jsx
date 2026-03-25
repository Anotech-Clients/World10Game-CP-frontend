import React, { useState, useEffect } from "react";
import {
  Box, Card, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, alpha,
} from "@mui/material";
import { Refresh as RefreshIcon, Search as SearchIcon } from "@mui/icons-material";
import { colors } from "./tournamentTheme";

const UserActivityTab = ({ axiosInstance, showSnackbar }) => {
  const [loading, setLoading] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUserActivity = async () => {
    setLoading(true);
    try {
      // Admin endpoint to get all users' tournament activity with default pagination
      const response = await axiosInstance.get("/api/admin/tournament/user-activity", {
        params: {
          page: 1,
          limit: 50
        }
      });
      
      if (response.data.success) {
        setUserActivity(response.data.data || []);
      } else {
        showSnackbar(response.data.error || "Failed to fetch user activity", "error");
        console.error("API returned error:", response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch user activity";
      showSnackbar(errorMessage, "error");
      console.error("Error fetching user activity:", error);
      
      // Log detailed error information for debugging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const filteredActivity = userActivity.filter((activity) =>
    searchQuery
      ? activity.userId.toString().includes(searchQuery) ||
        activity.tournament?.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          User Tournament Activity
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchUserActivity}>
          Refresh
        </Button>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="User ID or tournament name"
        />
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tournament</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Deposits</TableCell>
              <TableCell>Bets</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : filteredActivity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No activity found</TableCell>
              </TableRow>
            ) : (
              filteredActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.tournament?.name || "-"}</TableCell>
                  <TableCell>{activity.userId}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.isEligible ? "Eligible" : "Disqualified"}
                      size="small"
                      sx={{
                        backgroundColor: alpha(activity.isEligible ? colors.success : colors.error, 0.2),
                        color: activity.isEligible ? colors.success : colors.error,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {activity.currentRank ? `#${activity.currentRank}` : "-"}
                  </TableCell>
                  <TableCell>{Number(activity.totalScore || 0).toLocaleString()}</TableCell>
                  <TableCell>₹ {Number(activity.totalDeposits || 0).toLocaleString()}</TableCell>
                  <TableCell>₹ {Number(activity.totalBets || 0).toLocaleString()}</TableCell>
                  <TableCell>{new Date(activity.joinedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserActivityTab;
