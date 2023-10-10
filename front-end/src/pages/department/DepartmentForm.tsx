import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
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
  const [formTitle, setFormTitle] = useState<string>('');

  useEffect(() => {
    let text = 'Προσθέστε νέο τμήμα:';
    if (params && params?.id) {
      text='Πληροφορίες τμήματος:';
      axios
        .get(`${departmentUrl}/${params?.id}`)
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
      name: "",
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
            label="name"
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
