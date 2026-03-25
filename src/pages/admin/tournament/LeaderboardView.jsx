import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
  Stack,
  CircularProgress,
  Tooltip,
  alpha,
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  PersonOff as DisqualifyIcon,
} from "@mui/icons-material";
import { colors } from "./tournamentTheme";

const LeaderboardView = ({
  open,
  onClose,
  tournament,
  leaderboard,
  loading,
  page,
  rowsPerPage,
  totalLeaderboard,
  onPageChange,
  onRowsPerPageChange,
  onUpdateLeaderboard,
  onDisqualifyUser,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{tournament?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Leaderboard
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => onUpdateLeaderboard(tournament?.id)}
            disabled={loading}
          >
            Update Leaderboard
          </Button>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Score</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Deposits</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Bets</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Wingo Bets</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>K3 Bets</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No participants in leaderboard yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry, index) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>
                      <Chip
                        label={`#${entry.currentRank}`}
                        size="small"
                        sx={{
                          backgroundColor:
                            entry.currentRank === 1
                              ? alpha("#FFD700", 0.2)
                              : entry.currentRank === 2
                              ? alpha("#C0C0C0", 0.2)
                              : entry.currentRank === 3
                              ? alpha("#CD7F32", 0.2)
                              : alpha(colors.primary, 0.2),
                          color:
                            entry.currentRank === 1
                              ? "#FFD700"
                              : entry.currentRank === 2
                              ? "#C0C0C0"
                              : entry.currentRank === 3
                              ? "#CD7F32"
                              : colors.primary,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{entry.userId}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {entry.user?.userName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {Number(entry.totalScore).toLocaleString("en-IN")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      pkr {Number(entry.totalDeposits || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      pkr {Number(entry.totalBets || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      pkr {Number(entry.wingoBets || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      pkr {Number(entry.k3Bets || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Disqualify User">
                        <IconButton
                          size="small"
                          onClick={() => onDisqualifyUser(entry.userId)}
                          sx={{ color: colors.error }}
                        >
                          <DisqualifyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalLeaderboard}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardView;
