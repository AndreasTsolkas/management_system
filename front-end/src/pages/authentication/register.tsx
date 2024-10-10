import * as React from 'react';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import "src/index.css";
import * as Important from "src/important";
import { httpClient } from 'src/requests';




const defaultTheme = createTheme();

const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required."),
  surname: yup.string().required("Surname is required."),
  employeeUid: yup.number().required("Employee UId is required."),
  email: yup.string().required("Email is required.").email("Email must be valid."),
  startDate: yup.date().required("Start date is required."),
  password: yup.string().min(4,'Password must have at least 4 characters.').max(20, 'The password must not exceed 20 characters.').required("Password is required."),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Confirmation password should be correct.').required("Confirm the password."),
  employmentType: yup.string().required("Employment type is required."),
});

type FormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeUid: Number;
  employmentType: string;
  isAccepted: boolean;
  isAdmin: boolean;
  startDate: Date;
  department: Number | null;
  salary: Number;
  vacationDays: Number;
};

export default function SignUp() {

  const authUrl = Important.authUrl;
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const accessTokenCookie = Important.accessTokenCookie;

  React.useEffect(() => {
    const token = cookies[accessTokenCookie];
    if (token) 
      navigate('/');
  }, [navigate]);

  const { handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    
  });

  const onSubmit = async (data: FormData) => {  
    data.isAccepted=false;
    data.isAdmin=false;
    data.department=null;
    data.salary=0;
    data.vacationDays=0;
    const requestUrl = authUrl+'/register';
    try {
      const response = await httpClient.post(requestUrl, data );  
      navigate('/signin');
    } catch(error: any) {
      let message=error?.response?.data?.message;
      toast.error(message || 'An error occurred');
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
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name*"
                      error={!!errors.name}
                      helperText={errors.surname?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <Controller
                  name="surname"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Surname*"
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
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
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="startDate*"
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
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
                <Link fontSize="20px" href="/signin" variant="body2">
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