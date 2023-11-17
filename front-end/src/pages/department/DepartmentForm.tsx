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

const schema = yup.object({
  employeeId: yup
    .number()
    .typeError("Η συμπλήρωση του user id είναι απαραίτητη.")
    .required("Η συμπλήρωση του user id είναι απαραίτητη."),
  season: yup
    .string()
    .typeError("Η συμπλήρωση της εποχής που ο εργαζόμενος θα πάρει το bonus είναι απαραίτητη.")
    .required("Η συμπλήρωση της εποχής που ο εργαζόμενος θα πάρει το bonus είναι απαραίτητη."),
});

const DepartmentForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const departmentUrl = Important.backEndDepartmentUrl;
  const departmentId = params?.id;
  const employeeGetAll = Important.getAllEmployee;
  const [formTitle, setFormTitle] = useState<string>('');
  const [employees, setEmployees] = useState<any[]>([]);

  const getAndCountOnUserBaseUrl = Important.getAndCountOnUserBaseUrl;

  useEffect(() => {
    let text = 'Προσθέστε νέο τμήμα:';
    if (params && params?.id) {
      text='Πληροφορίες τμήματος:';
      axios
        .get(`${getAndCountOnUserBaseUrl}/${departmentId}`)
        .then((response) => {
          reset(response.data);
        })
        .catch((error) => console.log(error));
    }
    setFormTitle(text);
  }, []);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      departmentEntityData: { name: ""},
      employeeId: "",
    },
    resolver: yupResolver(DepartmentSchema),
  });

  const onSubmit = async (data:any) => {
    let success=false;
    if (!params?.id) {
      
      try {
        await axios.put(departmentUrl, data);
        toast.success('Το τμήμα δημιουργήθηκε με επιτυχία.');
        success=true;
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
    }
    else {
      try {
        await axios.patch(`${departmentUrl}/${params?.id}`, data, {
          headers: { "Content-Type": "application/json" }
        });
        toast.success('Οι αλλαγές έγιναν με επιτυχία.');
        success=true;
        
      } catch (error: any) {
        toast.error(error?.response.data.message);
      }
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
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  useEffect(() => {
    getAllEmployeesWithoutDepartment();
  }, []);

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
            name="departmentEntityData.name"
            label="Όνομα"
          />

          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
                <InputLabel htmlFor="employee-label">Προσθήκη νέου εργαζόμενου</InputLabel>
                <Select
                  {...field}
                  labelId="employee-label"
                  id="employee-label"
                  fullWidth
                  variant="outlined"
                >
                  {employees.map((item: any) => {
    
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
      </Box>
    </div>
  );
};

export default DepartmentForm;
