import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth} from "src/useAuth";
import { httpClient } from "src/requests";


export const DepartmentSchema = yup.object({
  name: yup.string().required("Department name is required."),
});


const DepartmentNewForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.departmentUrl;
  const departmentId = params?.id;
  const employeeGetAll = Important.getAllEmployee;
  const [formTitle, setFormTitle] = useState<string>('');
  const [registredEmployees, setRegisteredEmployees] = useState<any[]>([]);
  const [unregistredEmployees, setUnregisteredEmployees] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;

  hasAccessAuth();



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
    let text = 'Add a new department:';
    setFormTitle(text);
  }, []);

  

  const onSubmit = async (data:any) => {
    let success=false;
    try {
       await httpClient.put(departmentUrl, data);
        toast.success('The new department created successfully.');
        success=true;
    } catch (error: any) {
        toast.error(error?.response.data.message);
    }
    if(success) navigate("/department");
   };




  return (
    <div className="standart-page">
      
      {Display.DisplayIconButton()}
      
      <div style={{  marginTop:"20px", display: 'flex' }}>
      <Box
    
      >
        <div style={{marginLeft: '350px', marginTop:'30px'}}>
        <form  style={{width:"200px"}} noValidate onSubmit={handleSubmit(onSubmit)}>
          
          <MuiTextField
            errors={errors}
            control={control}
            name="name"
            label="Name of the new department"
          />

          <div style={{ marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginLeft:"55px", marginRight: '10px' }}
          >
            Create
          </Button>
          </div>
        </form>
        </div>
      </Box>
      </div>
    </div>
  );
};

export default DepartmentNewForm;

