import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
  Stack,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  PlayArrow as StartIcon,
  Stop as EndIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CardGiftcard as RewardIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { colors, getStatusColor } from "./tournamentTheme";

const TournamentTable = ({
  tournaments,
  loading,
  page,
  rowsPerPage,
  totalTournaments,
  onPageChange,
  onRowsPerPageChange,
  onViewTournament,
  onStartTournament,
  onEndTournament,
  onDeleteTournament,
  onDistributeRewards,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Participants</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Prize Pool</TableCell>
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
          ) : tournaments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No tournaments found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tournaments.map((tournament) => (
              <TableRow key={tournament.id} hover>
                <TableCell>{tournament.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {tournament.name}
                  </Typography>
                  {tournament.description && (
                    <Typography variant="caption" color="text.secondary">
                      {tournament.description.substring(0, 50)}
                      {tournament.description.length > 50 ? "..." : ""}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={tournament.type}
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.info, 0.2),
                      color: colors.info,
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={tournament.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(tournament.status), 0.2),
                      color: getStatusColor(tournament.status),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(tournament.startDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(tournament.endDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {tournament._count?.participants || 0}
                    {tournament.maxParticipants && ` / ${tournament.maxParticipants}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    pkr {Number(tournament.totalPrizePool || 0).toLocaleString("en-IN")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewTournament(tournament)}
                        sx={{ color: colors.info }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {tournament.status === "DRAFT" && (
                      <>
                        <Tooltip title="Start Tournament">
                          <IconButton
                            size="small"
                            onClick={() => onStartTournament(tournament.id)}
                            sx={{ color: colors.success }}
                          >
                            <StartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Tournament">
                          <IconButton
                            size="small"
                            onClick={() => onDeleteTournament(tournament.id)}
                            sx={{ color: colors.error }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {tournament.status === "ACTIVE" && (
                      <Tooltip title="End Tournament">
                        <IconButton
                          size="small"
                          onClick={() => onEndTournament(tournament.id)}
                          sx={{ color: colors.info }}
                        >
                          <EndIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {tournament.status === "ENDED" && (
                      <Tooltip title="Distribute Rewards">
                        <IconButton
                          size="small"
                          onClick={() => onDistributeRewards(tournament.id)}
                          sx={{ color: colors.success }}
                        >
                          <RewardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalTournaments}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </TableContainer>
  );
};

export default TournamentTable;
