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
import {hasAccessAuth, isAdminAuth} from "src/useAuth";


export const DepartmentSchema = yup.object({
  name: yup.string().required("Name is required."),
});


const DepartmentForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.backEndDepartmentUrl;
  const employeeUrl = Important.backEndEmployeeUrl;
  const departmentId = params?.id;
  const employeeGetAll = Important.getAllEmployee;
  const [formTitle, setFormTitle] = useState<string>('Department settings: ');
  const [employeesNum, setEmployeesNum] = useState<number>(0); 
  const [registredEmployees, setRegisteredEmployees] = useState<any[]>([]);
  const [unregistredEmployees, setUnregisteredEmployees] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;

  hasAccessAuth({ redirectTo: '/signIn' });



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
        const response = await axios.patch(requestUrl, body);
        await getDepartmentWithEmployees();
        await getAllEmployeesWithoutDepartment();
        
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
  };

  const submitNameChange = async (data:any) => {
      try {
        await axios.patch(`${departmentUrl}/${params?.id}`, data, {
          headers: { "Content-Type": "application/json" }
        });
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
      const response: any = await axios.get(`${requestUrl}/${departmentId}`);
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
      const response = await axios.get(requestUrl, {
        params: {
          field: 'department.id',
          value: 'null',
        },
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
      
      {Display.displayIconButton()}

      <h2 style={{ marginLeft: '200px' }}>{formTitle}</h2>
      
      <div style={{  marginTop:"20px", display: 'flex' }}>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <h3>Όνομα: </h3>
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
          <h3>Add an employee: </h3>
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
        <h3>No avaliable employee to add.</h3>
      )}
      </div>
      </Box>
      <Box
        sx={{
          marginLeft:"250px",
          width: "300px",
        }}
      >
        {employeesNum > 0 && (
        <>
          <h3>Employees: {employeesNum}</h3>
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

