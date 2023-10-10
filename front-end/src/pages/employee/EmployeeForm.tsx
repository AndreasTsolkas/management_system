	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import { DepartmentSchema } from "../department/DepartmentForm";
import { IPost } from "./employee.model";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";

// create schema validation
export const NewEmployeeSchema = yup.object({
  //id: yup.number().required("id is required"),
  name: yup.string().required("name is required").min(2).max(20),
  surName: yup.string().required("surname is required").min(2).max(20),
  email: yup.string().email().required("email is required"),
  startDate: yup.date().required("Start Date is required"),
  vacationDays: yup.number().required("Vacation days are required"),
  salary: yup.number().required("Salary is required"),
  employmentType: yup.string().required("Employment type is required"),
  //employeeCompany: CompanySchema.required("Employee Company is required"),
  employeeDepartment: yup.object().shape({
    id: yup.number().required("Company id is required!")
  })
});

const EmployeeForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.backEndEmployeeUrl;
  const [formTitle, setFormTitle] = useState<string>('');


  useEffect(() => {
    let text = 'Προσθέστε νέο εργαζόμενο:';
    if (params && params?.id) {
      text='Πληροφορίες εργαζόμενου:';
      axios
        .get(`${employeeUrl}/${params?.id}`)
        .then((response) => {
          reset(response.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
    setFormTitle(text);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
       id: "",
       name: "",
       surName: "",
       email: "",
       startDate: "",
       vacationDays: "",
       salary: "",
       employmentType: "",
       employeeCompany: {id: ""},
     },
    resolver: yupResolver(NewEmployeeSchema),
  });

   const onSubmit = async (data:any) => {
    let success=false;
    if (!params?.id) {
      
      
  
      try {
        await axios.post(employeeUrl, data);
        toast.success('Employee created successfully');
        success=true;
      } catch (error) {
        toast.error('Failed to create employee');
      }
    }
    else {
      try {
        await axios.put(`${employeeUrl}/${params?.id}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        toast.success("Employee updated successfully");
        success=true;
        
      } catch (error) {
        toast.error('Failed to update employee');
      }
    }
    if(success) navigate("/employee");
   };

  return (
    <div>
      
      {Display.displayIconButton()}
      
      <h2>{formTitle}</h2>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <MuiTextField
            
            errors={errors}
            control={control}
            name="name"
            label="NAME"
          />
          <MuiTextField
            
            errors={errors}
            control={control}
            name="surName"
            label="SURNAME"
          />
          <MuiTextField
            
            errors={errors}
            control={control}
            name="email"
            label="EMAIL"
          />
          <MuiTextField
           
            errors={errors}
            control={control}
            name="startDate"
            label="STARTDATE"
          />
          <MuiTextField
            
            errors={errors}
            control={control}
            name="vacationDays"
            label="VACATION DAYS"
          />
          <MuiTextField
           
            errors={errors}
            control={control}
            name="salary"
            label="SALARY"
          />
          <MuiTextField
            
            errors={errors}
            control={control}
            name="employmentType"
            label="EMPLOYMENT TYPE"
          />
          <MuiTextField
            
            errors={errors}
            control={control}
            name="employeeCompany.id"
            label="Employee Company"
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
          Submit
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default EmployeeForm;