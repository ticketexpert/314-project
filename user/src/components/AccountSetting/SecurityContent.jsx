import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Alert, Divider, List, ListItem, ListItemIcon, ListItemText, Switch, LinearProgress, Stack
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import { useUser } from "../../context/UserContext";

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

function getStrengthLabel(score) {
  switch (score) {
    case 0: return { label: "Very Weak", color: "error" };
    case 1: return { label: "Weak", color: "warning" };
    case 2: return { label: "Fair", color: "warning" };
    case 3: return { label: "Good", color: "info" };
    case 4: return { label: "Strong", color: "success" };
    case 5: return { label: "Very Strong", color: "success" };
    default: return { label: "Very Weak", color: "error" };
  }
}

export default function SecurityContent() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      setSuccess("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          twoFactorEnabled: !twoFA
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update 2FA settings');
      }

      setTwoFA(!twoFA);
      setSuccess(`Two-factor authentication ${!twoFA ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError(err.message || "Failed to update 2FA settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(passwordStrength);

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        background: "#fff",
        borderRadius: 4,
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#166534" }}>
        Login and Security
      </Typography>

      <Typography mb={2} color="text.secondary">
        For your security, we recommend using a strong, unique password for your account.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Current Password"
          fullWidth
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#166534' },
              '&.Mui-focused fieldset': { borderColor: '#166534' },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#166534',
            },
          }}
        />
        <TextField
          label="New Password"
          fullWidth
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#166534' },
              '&.Mui-focused fieldset': { borderColor: '#166534' },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#166534',
            },
          }}
        />
        {formData.newPassword && (
          <Box mb={2}>
            <Box display="flex" alignItems="center" mb={0.5}>
              <Typography fontSize="0.95rem" color="text.secondary" mr={1}>
                Password Strength:
              </Typography>
              <Typography fontWeight="bold" color={`${strengthColor}.main`}>
                {strengthLabel}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(passwordStrength / 5) * 100}
              color={strengthColor}
              sx={{
                height: 10,
                borderRadius: 5,
                background: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  transition: "width 0.4s",
                },
              }}
            />
          </Box>
        )}
        <TextField
          label="Reconfirm New Password"
          fullWidth
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#166534' },
              '&.Mui-focused fieldset': { borderColor: '#166534' },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#166534',
            },
          }}
        />

        <List dense sx={{ mb: 2 }}>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="At least 8 characters" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Use a mix of letters, numbers, and symbols" />
          </ListItem>
        </List>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          variant="contained"
          sx={{ backgroundColor: "#166534", mt: 2, fontWeight: "bold", fontSize: "1rem" }}
          onClick={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SecurityIcon color={twoFA ? "success" : "disabled"} />
          <Typography fontWeight="bold">Two-Factor Authentication (2FA)</Typography>
        </Stack>
        <Switch
          checked={twoFA}
          onChange={handleToggle2FA}
          disabled={isLoading}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#166534",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#166534",
            },
            transform: "scale(1.2)",
          }}
        />
      </Box>
      <Typography fontSize="15px" color="gray" mb={2}>
        {twoFA
          ? "2FA is enabled. You will be asked for a code when logging in."
          : "Add an extra layer of security to your account by enabling 2FA."}
      </Typography>
    </Box>
  );
}
