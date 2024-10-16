import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, Link, MenuItem, Select, Switch } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { DisplayViewTitle } from "src/display";
import {hasAccessAuth, isAdminAuth} from "src/useAuth";
import { httpClient } from "src/requests";


export const NewEmployeeSchema = yup.object({
  name: yup.string().required("Name is required.").min(2).max(20),
  surname: yup.string().required("Surname is required.").min(2).max(20),
  email: yup.string().email().required("Email is required."),
  password: yup.string().required("Password is required."),
  employeeUid: yup.number().required("Employee UId is required."),
  startDate: yup.date().required("Start date is required."),
  vacationDays: yup.number().required("Vacation days is required."),
  salary: yup.number().required("Salary is required."),
  employmentType: yup.string().required("Employment type is required."),
});

const EmployeeForm = () => {
  const params = useParams();
  const [departments, setDepartments] = useState<any[]>([]);
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const passwordUrl = Important.passwordUrl;
  const departmentGetAll = Important.getAllDepartment;
  const [formTitle, setFormTitle] = useState<string>('Add a new employee:');
  const [employeeCurrentDepartmentId, setEmployeeCurrentDepartmentId] = useState<any | null >(null);
  const [employeeSelectedDepartmentId, setEmployeeSelectedDepartmentId] = useState<any>('');
  const isProfile = params?.profile === 'true';
  const employeeId = params?.id;
  const passwordRedirectUrl = passwordUrl+'/'+employeeId;

  hasAccessAuth();
  if(!isProfile) // If a user call this page to modify its data he/she can access it even if is not admin, else the 'isAdminAuth' will be executed to filter admins
    isAdminAuth();
  


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      employeeUid: "",
      startDate: "",
      vacationDays: "",
      salary: "",
      employmentType: "",
      department: employeeSelectedDepartmentId,
      isAccepted: true,
      isAdmin: true
    },
    resolver: yupResolver(NewEmployeeSchema),
  });

  const onReset = async (data: any) => {
    setEmployeeCurrentDepartmentId(null);
    setEmployeeSelectedDepartmentId(null);
    reset(data);
    await getEmployee();
    await getAllDepartments();
  }

  const onSubmit =  async (data: any) => {
    if(data.department==='')
      data.department = departments[0].id;
    let success = false;
    let response: any = '';
    if (isProfile) {
      try {
        response = await httpClient.put(employeeUrl, data);
        toast.success('The new employee was created successfully');
        success = true;
      } catch (error) {
        toast.error('New employee creation failed');
      }
    } else {
      try {
         response = await httpClient.patch(`${employeeUrl}/${employeeId}`, data);
        toast.success("Employee updated successfully");
        success = true;

      } catch (error) {
        toast.error('Employee update failed');
      }
    }
    if (success) navigate('/employee/view/'+response.data.id);
  };


  const getEmployee = async () => {
    if(employeeId) {
      return await httpClient
        .get(`${employeeUrl}/${employeeId}`)
        .then((response) => {
          reset(response.data);
          if (response.data.department.name !== null || response.data.department.name !== null)
            setEmployeeCurrentDepartmentId(response.data.department.id);
          setValue('isAdmin', response.data.isAdmin);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  }
  

  async function getAllDepartments() {
    const requestUrl = departmentGetAll;
    try {
      const response: any = await httpClient.get(requestUrl);
      setDepartments(response.data);
    }
    catch (error: any) {
      toast.error(error?.response.data.message);
    }

  }

  const setFormTitleText = () => {
    let text = '';
    if (params && params?.id) {
      text = 'Employee settings:';
      if(params?.profile)
        text = 'My settings:';
      setFormTitle(text);
    }
  }


  useEffect(() => {
    getAllDepartments();
  }, []);

  useEffect(() => {
    getEmployee();
  }, []);

  useEffect(() => {
    setFormTitleText();
  }, [employeeId]);

  useEffect(() => {
    if (departments.length > 0) {
      let defaultDepartmentId = departments[0].id;
      if (params?.id) {
        defaultDepartmentId = employeeCurrentDepartmentId;
      }
      setEmployeeSelectedDepartmentId(defaultDepartmentId);
    }
  }, [departments]);

  console.log(formTitle)
  
  return (
    <div className="standart-page">
      {Display.DisplayIconButton(isProfile)}
      <DisplayViewTitle text={formTitle} />
      <Box
        sx={{
          width: "500px",
          marginTop:"30px"
        }}
      >
        <form  onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="name"
                label="Name"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="surname"
                label="Surname"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="email"
                label="Email"
              />
            </Grid>
            {!params?.id && (
              <Grid item xs={4}>
                <MuiTextField
                  errors={errors}
                  control={control}
                  name="password"
                  label="Password"
                />
              </Grid>
            )}
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="employeeUid"
                label="Employee UId"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="startDate"
                label="Start datetime"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="vacationDays"
                label="Vacation days (limit)"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="salary"
                label="Salary"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="employmentType"
                label="Employment type"
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="department"
                control={control}
                render={ ({ field }) => {
                     
                  return (
                  <div >
                    <Select
                      {...field}
                      labelId="employee-label"
                      id="employee-label"
                      fullWidth
                      variant="outlined"
                      value={employeeSelectedDepartmentId || '' }
                      onChange={(event) => {
                        field.onChange(event);
                        setEmployeeSelectedDepartmentId(event.target.value);
                      }}
                    >
                      {departments.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} 
                        </MenuItem>
                      ))}
                      
                    </Select>
                  </div>
                );}}
              />
            </Grid>

            <Controller
              name="isAdmin"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked = {field.value} {...field} />}
                  name="isAdmin"
                  label="Is admin"
                  sx={{ marginLeft: "20px", marginTop: "20px" }}
                />
              )}
            />
            
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <Button
            type="reset"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            style={{ marginLeft: "20px" }}
          >
            Reset
          </Button>
        </form>
      </Box>
      <div style={{marginTop:"10px"}}>
      {isProfile && (
         <Link fontSize="20px" href={passwordRedirectUrl} variant="body2">
           Do you want to change your password? Click here.
         </Link>
      )}
      </div>
    </div>
  );
};

export default EmployeeForm;
