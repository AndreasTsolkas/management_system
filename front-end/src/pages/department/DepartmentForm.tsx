import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, InputLabel, MenuItem, Select } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";


export const DepartmentSchema = yup.object({
  name: yup.string().required("Ειναι απαραίτητο να προσθέσετε το όνομα του τμήματος."),
});


const DepartmentForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.backEndDepartmentUrl;
  const departmentId = params?.id;
  const employeeGetAll = Important.getAllEmployee;
  const [formTitle, setFormTitle] = useState<string>('');
  const [registredEmployees, setRegisteredEmployees] = useState<any[]>([]);
  const [unregistredEmployees, setUnregisteredEmployees] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;



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

  useEffect(() => {
    let text = 'Προσθέστε νέο τμήμα:';
    if (params && params?.id) {
      text='Πληροφορίες τμήματος:';
      axios
        .get(`${getAndCountOnUserBaseUrl}/${departmentId}`)
        .then((response) => {
          setRegisteredEmployees(response.data?.employees);
          reset({
            name: response.data?.departmentEntityData?.name,
          });
          
        })
        .catch((error) => console.log(error));
    }
    
    setFormTitle(text);
  }, []);

  

  const onSubmit = async (data:any) => {
    let success=false;

      try {
        await axios.patch(`${departmentUrl}/${params?.id}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        toast.success('Οι αλλαγές έγιναν με επιτυχία.');
        success=true;
        
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
    if(success) navigate("/department");
   };

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
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
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
            Υποβολή
          </Button>
          </div>
        </form>

        <div style={{marginTop:"60px"}}>
        <h3>Προσθήκη εργαζόμενου: </h3>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
        
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
                  {unregistredEmployees.map((item: any) => {
    
                    return (
                    <MenuItem key={item.id} value={item.id}>
                       {item.name} {item.surname}, {item.salary}$ μισθός, 
                    </MenuItem>
                    );
                  })} 
                </Select>
                <span style={{ color: "red" }}>{errors.employeeId?.message}</span>
              </div>
            )}
          /> 

          <div style={{ marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginRight: '10px' }}
          >
            Υποβολή
          </Button>
          </div>
        </form>
        </div>
      </Box>
      <Box
        sx={{
          marginLeft:"250px",
          width: "200px",
        }}
      >
        <h3>Εργαζόμενοι: </h3>
        <ul>
          {registredEmployees.map((item: any) => (
            <li key={item.id} style={{ fontSize: '20px' }}>{item.name} {item.surname}, {item.salary}$ μισθός </li>
          ))}
        </ul>
      </Box>
      </div>
    </div>
  );
};

export default DepartmentForm;

