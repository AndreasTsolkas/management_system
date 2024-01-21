import * as React from 'react';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FormControl, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import MuiTextField from "src/components/MuiTextField";
import MuiSelectField from "src/components/MuiSelectField";
import "src/index.css";
import { Link as RouterLink } from 'react-router-dom';




const defaultTheme = createTheme();

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Name is required."),
  lastName: yup.string().required("Surname is required."),
  employeeUid: yup.number().required("Employee UId is required."),
  email: yup.string().required("Email is required.").email("Email must be valid."),
  password: yup.string().min(4,'Password must have at least 4 characters.').max(20, 'The password must not exceed 20 characters.').required("Password is required."),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Οι κωδικοί πρέπει να ταιριάζουν.').required("Επιβεβαιώστε τον κωδικό."),
  employmentType: yup.string().required("Employment type is required."),
});

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeUid: Number;
  employmentType: string;
};

export default function SignUp() {

  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      /*navigate('/projects');*/
    }
  }, [navigate]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    
  });

  const onSubmit = async (data: FormData) => {  
    try {
      const response = await axios.post(`${'thisUrl'}`, data );  
      navigate('/signin');
    } catch(error: any) {
      let message=error?.response?.data?.message;
      toast.error(message);
    }
  };

  return (
    <div className='authentication-pages'>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline>
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
        <Avatar sx={{ width: 94, height: 94, marginBottom: '30px' }}
        src="https://t3.ftcdn.net/jpg/04/62/48/52/360_F_462485281_5KvGWMEhKb8GyOBXs0pV5vRt7gNw1mD3.jpg" />
          <Typography component="h1" variant="h5">
            Register
          </Typography>
         <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name*"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Surname*"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email*"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              </Grid>
              <Grid item xs={12}>
              <Controller
                name="employeeUid"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="employeeUid*"
                    error={!!errors.employeeUid}
                    helperText={errors.employeeUid?.message}
                    fullWidth
                  />
                )}
              />
              </Grid>
              <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password*"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                  />
                )}
              />
              </Grid>
              <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm password*"
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    fullWidth
                  />
                )}
              />
              </Grid> 
              <Grid item xs={12}>
              <Controller
                name="employmentType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employment type*"
                    error={!!errors.employmentType}
                    helperText={errors.employmentType?.message}
                    fullWidth
                  />
                )}
              />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                Already have an account? Sign in here
                </Link>
              </Grid>
            </Grid>
          </Box> 
        </Box>
        </CssBaseline>
      </Container>
    </ThemeProvider>
    </div>
  );
}