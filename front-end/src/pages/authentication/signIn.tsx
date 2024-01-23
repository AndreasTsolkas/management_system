import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import "src/index.css";
import * as Important from "src/important";




const defaultTheme = createTheme();

export default function SignIn() {
  
  const navigate = useNavigate();
  const authUrl = Important.backEndAuthUrl;
  const[isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestUrl = authUrl+'/signin';
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as  string;
    const password = data.get('password') as string;

    
    
    try {
      setIsLoading(true);
      const response = await axios.post(requestUrl, {email, password});
      console.log(response.status);
      const token = response.data.token;

      const admin = response.data.admin;


      localStorage.setItem('token', token);
      localStorage.setItem('admin', admin);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoggedIn(true);

      if(admin) {
        
      }else{
        
      }
    
    } catch(error: any) {
      console.log(error?.response?.status);
      let message = 'Κατι πήγε στραβά...δοκιμάστε ξανα!';
      if(error.response?.status === 401) message = 'thisMessage';
      toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); 
    }
  }, [navigate, localStorage.getItem('token')]);

  return (
    <div className='authentication-pages'>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            
            <Box sx={{ display: 'flex', mt: 2 }}>
              <CircularProgress  sx={{color:'#BA1E4C'}}/>
            </Box>
          ) : (
            <>
              <Avatar sx={{ width: 94, height: 94, marginBottom: '30px' }}
                src="https://t3.ftcdn.net/jpg/04/62/48/52/360_F_462485281_5KvGWMEhKb8GyOBXs0pV5vRt7gNw1mD3.jpg" />
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button type="submit" color="primary" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"You do not have an account; Register here"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
        </>
        )}  
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
}