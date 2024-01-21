import { Link, Outlet, useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; 
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useState } from "react";


export default function Root() {

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const settings = ['My Profile', 'Sign Out'];
  const standartIlMarginBottom = '-7px';

  const isLoggedIn: boolean = true;

  const navigate = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleProfileClick = () => {
      navigate('/'); 
      handleCloseUserMenu();
    }

    const logoutUser = async () => {
      try {
        if (isLoggedIn) {
            setIsLoading(true); 
            localStorage.removeItem('token');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            navigate('/signIn');
        }
      } catch (error) {
          console.log(error);
          return [];
      } 
    }

  const isAdmin = false;
  return (
    <>
      <div id="sidebar">
        <nav>
        <div style ={{marginBottom: "30px", marginLeft:"15px", marginTop:"80px"}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, size: "30px" }} >
                <Avatar src="/broken-image.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '0px',
                transform: 'translateX(70px)'
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={() => {
                  if (setting === 'Sign Out') {
                    logoutUser();
                  } else if (setting === 'My Profile') {
                    handleProfileClick();
                  } else {
                    handleCloseUserMenu();
                  }
                }}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
          </Menu>
          </div>
          <ul>

            <li style={{marginBottom:standartIlMarginBottom}}>
              <Link to={`/department`}>Departments</Link>
            </li>
            <li style={{marginBottom:standartIlMarginBottom}}>
              <Link to={`/employee`}>Employees</Link>
            </li>
            <li style={{marginBottom:standartIlMarginBottom}}>
              <Link to={`/bonus`}>Bonus</Link>
           </li>
            <li style={{marginBottom:standartIlMarginBottom}}>
              <Link to={`/vacation_request`}>VR's</Link>
            </li>
          </ul>
          
          {isAdmin ? (
  <ul >
    <li style={{marginBottom:standartIlMarginBottom}}>
      <Link to={`/pvacation_request`}>Pending VR's</Link>
    </li>
    <li style={{marginBottom:standartIlMarginBottom}}>
      <Link to={`/createbonuses`}>Bonus creation</Link>
    </li>
  </ul>
) : (
  <ul >
  <li style={{marginBottom:standartIlMarginBottom}}>
    <Link to={`/uservacationrequest`}>New VR</Link>
  </li>
  </ul>
)}

        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
