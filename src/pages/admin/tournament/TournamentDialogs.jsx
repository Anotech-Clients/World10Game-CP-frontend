import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { availableGames } from "./tournamentTheme";

export const CreateTournamentDialog = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading,
}) => {
  const addReward = () => {
    const newRank = formData.rewards.length + 1;
    const suffix = newRank === 1 ? "st" : newRank === 2 ? "nd" : newRank === 3 ? "rd" : "th";
    setFormData({
      ...formData,
      rewards: [
        ...formData.rewards,
        { rank: newRank, rankLabel: `${newRank}${suffix} Place`, rewardAmount: 0 },
      ],
    });
  };

  const removeReward = (index) => {
    setFormData({
      ...formData,
      rewards: formData.rewards.filter((_, i) => i !== index),
    });
  };

  const updateReward = (index, field, value) => {
    const newRewards = [...formData.rewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setFormData({ ...formData, rewards: newRewards });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Tournament</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Tournament Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter tournament name"
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter tournament description"
          />

          <FormControl fullWidth required>
            <InputLabel>Tournament Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Tournament Type"
            >
              <MenuItem value="BET_BASED">Bet Based</MenuItem>
              <MenuItem value="DEPOSIT_BASED">Deposit Based</MenuItem>
              <MenuItem value="WIN_BASED">Win Based</MenuItem>
              <MenuItem value="MIXED">Mixed</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Deposit Amount"
                type="number"
                fullWidth
                value={formData.minimumDepositAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minimumDepositAmount: Number(e.target.value) })
                }
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Bet Amount"
                type="number"
                fullWidth
                value={formData.minimumBetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minimumBetAmount: Number(e.target.value) })
                }
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Maximum Participants (Optional)"
            type="number"
            fullWidth
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            placeholder="Leave empty for unlimited"
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth required>
            <InputLabel>Included Games</InputLabel>
            <Select
              multiple
              value={formData.includedGames}
              onChange={(e) => setFormData({ ...formData, includedGames: e.target.value })}
              label="Included Games"
              renderValue={(selected) => selected.join(", ")}
            >
              {availableGames.map((game) => (
                <MenuItem key={game} value={game}>
                  <Checkbox checked={formData.includedGames.indexOf(game) > -1} />
                  {game}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
            }
            label="Public Tournament (Visible to all users)"
          />

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Rewards Configuration
            </Typography>
            {formData.rewards.map((reward, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Rank"
                    type="number"
                    fullWidth
                    value={reward.rank}
                    onChange={(e) => updateReward(index, "rank", Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Label"
                    fullWidth
                    value={reward.rankLabel}
                    onChange={(e) => updateReward(index, "rankLabel", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Amount (₹ )"
                    type="number"
                    fullWidth
                    value={reward.rewardAmount}
                    onChange={(e) => updateReward(index, "rewardAmount", Number(e.target.value))}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => removeReward(index)}
                    color="error"
                    disabled={formData.rewards.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={addReward} variant="outlined">
              Add Reward Tier
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create Tournament"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DisqualifyDialog = ({ open, onClose, onSubmit, formData, setFormData, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Disqualify Participant</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            User ID: {formData.userId}
          </Typography>
          <TextField
            label="Reason for Disqualification"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Enter the reason for disqualifying this participant"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Disqualify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
