import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

import DeleteIcon from "@mui/icons-material/Delete";
import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";
import { DisplayGenericTitle, DisplayIconButton, DisplaySmallGenericTitle, DisplayTableTitle } from "src/display";


export const DepartmentSchema = yup.object({
  name: yup.string().required("Name is required."),
});


const DepartmentForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.departmentUrl;
  const employeeUrl = Important.employeeUrl;
  const departmentId = params?.id;
  const employeeGetAll = Important.getAllEmployee;
  const [formTitle, setFormTitle] = useState<string>('Department settings: ');
  const [employeesNum, setEmployeesNum] = useState<number>(0); 
  const [registredEmployees, setRegisteredEmployees] = useState<any[]>([]);
  const [unregistredEmployees, setUnregisteredEmployees] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;

  hasAccessAuth();
  isAdminAuth();



  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: '',
      employeeId: "",
    },
    resolver: yupResolver(DepartmentSchema),
  });

  const changeEmployeeToDepartmentValue = async (employeeId: number, departmentValue: any) => {
    const requestUrl = employeeUrl+'/'+employeeId;
      try {
        const body = {
          department: departmentValue
        };
        const response = await httpClient.patch(requestUrl, body);
        await getDepartmentWithEmployees();
        await getAllEmployeesWithoutDepartment();
        
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
  };

  const submitNameChange = async (data:any) => {
      try {
        await httpClient.patch(`${departmentUrl}/${params?.id}`, data);
        toast.success('Changes performed successfully.');
        await getDepartmentWithEmployees();
        
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
  };

  const submitAddNewEmployee = async (data:any) => {
    let employeeId = data.employeeId;
    let departmentValue = departmentId;
    try {
      await changeEmployeeToDepartmentValue(employeeId, departmentValue);
        
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

   const getDepartmentWithEmployees =  async () => {
    const requestUrl = getAndCountOnUserBaseUrl;
    try {
      const response: any = await httpClient.get(`${requestUrl}/${departmentId}`);
      setRegisteredEmployees(response.data?.employees);
      setEmployeesNum(response.data?.employeesNum);
      reset({
        name: response.data?.departmentEntityData?.name,
      });
    }

    catch(error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  }

   const getAllEmployeesWithoutDepartment =  async () => {
    const requestUrl = employeeGetAll+'/condition';
    try {
      const response = await httpClient.get(requestUrl, 
        {
          field: 'department.id',
          value: 'null',
        });
      setUnregisteredEmployees(response.data);
    }

    catch(error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  }

  const deleteEmployeeFromDepartment = async (employeeId: number) => {
    let departmentValue = null;
    try {
      await changeEmployeeToDepartmentValue(employeeId, departmentValue);
    }

    catch(error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    getDepartmentWithEmployees();
  }, []);

  useEffect(() => {
    getAllEmployeesWithoutDepartment();
  }, []);


  return (
    <div>
      
      {Display.DisplayIconButton()}

      <div style={{ marginLeft: '220px', marginBottom:'30px' }}>
        <DisplayGenericTitle text= {'Department settings: '} />
      </div>
      
      <div style={{  marginTop:"20px", display: 'flex' }}>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <DisplaySmallGenericTitle text= {'Name: '} />
        <form noValidate onSubmit={handleSubmit(submitNameChange)}>
          
          <MuiTextField
            errors={errors}
            control={control}
            name="name"
            label=""
          />

          <div style={{ marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginRight: '10px' }}
          >
            <CheckIcon fontSize="small"></CheckIcon>
          </Button>
          </div>
        </form>

        <div style={{marginTop:"60px"}}>
        {unregistredEmployees.length > 0 ? (
        <>

          <DisplaySmallGenericTitle text= {'Add an employee:'} />
          <form noValidate onSubmit={handleSubmit(submitAddNewEmployee)}>
            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    labelId="employee-label"
                    id="employee-label"
                    fullWidth
                    variant="outlined"
                  >
                    {unregistredEmployees.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name} {item.surname}, {item.salary}$ salary,
                      </MenuItem>
                    ))}
                  </Select>
                  <span style={{ color: 'red' }}>{errors.employeeId?.message}</span>
                </div>
              )}
            />
            <div style={{ marginTop: '10px' }}>
              <Button type="submit" variant="contained" sx={{ marginRight: '10px' }}>
                <CheckIcon fontSize="small"></CheckIcon>
              </Button>
            </div>
          </form>
        </>
      ) : (
        <DisplaySmallGenericTitle text= {'No avaliable employee to add.'} />
      )}
      </div>
      </Box>
      <Box
        sx={{
          marginLeft:"300px",
          width: "300px",
        }}
      >
        {employeesNum > 0 && (
        <>
          <DisplaySmallGenericTitle text= {'Employees: '+employeesNum} />
          <ul>
            {registredEmployees.map((item: any) => (
              <li key={item.id} style={{ fontSize: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.name} {item.surname}, {item.employmentType}, μισθός {item.salary}$ 

                  <IconButton 
                    disabled={false} 
                    color="warning" 
                    style={{ marginLeft: '10px' }}
                    onClick={()=> deleteEmployeeFromDepartment(item.id)}
                    >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      </Box>
      </div>
    </div>
  );
};

export default DepartmentForm;

