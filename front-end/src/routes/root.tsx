import { Link, Outlet, useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import * as Important from "src/important";


export default function Root() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const adminCookie = Important.adminCookie;
  const isAdmin = JSON.parse(cookies[adminCookie] || 'false');
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const accessTokenCookie = Important.accessTokenCookie;
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
      navigate('/profile'); 
      handleCloseUserMenu();
    }

    const logoutUser = async () => {
      try {
        if (isLoggedIn) {
            removeCookie(accessTokenCookie);
            removeCookie(adminCookie);
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/signIn');
        }
      } catch (error) {
          console.log(error);
          return [];
      } 
    }

  
  return (
    <>
      <div id="sidebar">
        <nav>
        <div style ={{marginBottom: "30px", marginLeft:"15px", marginTop:"60px"}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, size: "30px" }} >
              <Avatar sx={{ width: 64, height: 64, marginBottom: '20px' }}
                src="https://t3.ftcdn.net/jpg/04/62/48/52/360_F_462485281_5KvGWMEhKb8GyOBXs0pV5vRt7gNw1mD3.jpg" />
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
              <Link to={`/bonus`}>Bonuses</Link>
           </li>
            <li style={{marginBottom:standartIlMarginBottom}}>
              <Link to={`/vacation_request`}>Leaves</Link>
            </li>
          </ul>
          
          {isAdmin ? (
  <ul >
    <li style={{marginBottom:standartIlMarginBottom}}>
      <Link to={`/pvacation_request`}>Pending Leaves</Link>
    </li>
    <li style={{marginBottom:standartIlMarginBottom}}>
      <Link to={`/createbonuses`}>Bonus creation</Link>
    </li>
  </ul>
) : (
  <ul >
  <li style={{marginBottom:standartIlMarginBottom}}>
    <Link to={`/uservacationrequest`}>New Leave</Link>
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
