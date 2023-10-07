import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userToken");
    Cookies.remove("userInfo");
    alert("You have been logged out");
    navigate("/login");
  };
  return (
    <Card className="h-[95vh] fixed m-4 w-[275px] p-4 shadow-xl">
      <div className="mb-2 p-4 flex items-center gap-4">
        <img
          className="h-12 w-12 rounded-lg object-cover object-center"
          src="/admin/logo_ukmik.png"
          alt="logo IK"
        />
        <div>
          <Typography variant="h5" color="blue-gray">
            Dashboard
          </Typography>
          <Typography variant="h6" color="blue">
            UKM IK
          </Typography>
        </div>
      </div>
      <List>
        <NavLink to="/dashboard/overview" className={({ isActive }) => isActive ? "active bg-blue-600 text-white rounded-xl" : ""}>
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </NavLink>
        <NavLink
          to="/dashboard/recruitment"
          className={({ isActive }) => isActive ? "active bg-blue-600 text-white rounded-xl" : ""}
        >
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Data Calon Anggota IK
          </ListItem>
        </NavLink>
        <ListItem onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
