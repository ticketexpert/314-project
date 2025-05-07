import React from "react";
import { Avatar, Menu, MenuItem, IconButton, ListItemIcon, Divider } from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";

const AvatarDemo = ({ onLogout }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
			<IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
				<Avatar
					src=""
					alt="User Avatar"
					sx={{ width: 36, height: 36 }}
				/>
				<ArrowDropDownIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 3,
					sx: {
						mt: 1.5,
						minWidth: 160,
						borderRadius: 2,
					},
				}}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={() => { navigate('/account'); }}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<Divider />
				<MenuItem onClick={onLogout}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</div>
	);
};

export default AvatarDemo;
