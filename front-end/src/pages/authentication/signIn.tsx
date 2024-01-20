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


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://filmcluster.gr/" target="_blank">
        Film Cluster
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  
  const navigate = useNavigate();
  const[isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState<boolean>(false);
  



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as  string;
    const password = data.get('password') as string;

    
    
    try {
      setIsLoading(true);
      const response = await axios.post(`${'thisUrl'}`, {email, password});
      console.log(response.status);
      const token = response.data.token;

      const admin = response.data.admin;


      localStorage.setItem('token', token);
      localStorage.setItem('admin', admin);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoggedIn(true);

      if(admin) {
        navigate('/categories');
      }else{
        navigate('/projects');
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
      navigate('/projects'); // Είναι καρφωτό για τώρα, θα αλλάξει πιο μετά
    }
  }, [navigate, localStorage.getItem('token')]);

  return (
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
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Σύνδεση
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
                  label="Κωδικός"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button type="submit" color="primary" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Συνδεθειτε
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="#/register" variant="body2">
                      {"Δεν έχετε λογαριασμό; Κάντε εγγραφή εδώ"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            
        <Copyright />
        </>
        )}  
        </Box>
      </Container>
    </ThemeProvider>
  );
}