import * as React from "react";
import { Avatar } from "radix-ui";
import { DropdownMenu } from "radix-ui";
import { CaretDownIcon, GearIcon, ExitIcon} from "@radix-ui/react-icons";
import "./Avatar.css";
import { useNavigate } from "react-router-dom";

const AvatarDemo = ({ onLogout }) => {
	const [avatarType, setAvatarType] = React.useState("default"); // default, premium, admin
	const navigate = useNavigate();
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<div style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
						<Avatar.Root className={`AvatarRoot ${avatarType}`}>
							<Avatar.Image
								className="AvatarImage"
								src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
								alt="User Avatar"
							/>
							<Avatar.Fallback className="AvatarFallback" delayMs={600}>
								{avatarType === "admin" ? "AD" : "US"}
							</Avatar.Fallback>
						</Avatar.Root>
						<CaretDownIcon />
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content className="DropdownMenuContent" sideOffset={2} onClick={() => navigate("/account")}>
						<DropdownMenu.Item className="DropdownMenuItem">
							<GearIcon className="DropdownMenuIcon" />
							Settings
						</DropdownMenu.Item>
						<DropdownMenu.Item className="DropdownMenuItem" onClick={onLogout}>
							<ExitIcon className="DropdownMenuIcon" />
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	);
};

export default AvatarDemo;
