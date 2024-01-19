import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";

export const NewEmployeeSchema = yup.object({
  name: yup.string().required("Το όνομα απαιτείται").min(2).max(20),
  surname: yup.string().required("Το επώνυμο απαιτείται").min(2).max(20),
  email: yup.string().email().required("Το email απαιτείται"),
  password: yup.string().required("Ο κωδικός απαιτείται"),
  employeeUid: yup.number().required("Ο αριθμός μητρώου απαιτείται"),
  startDate: yup.date().required("Η ημερομηνία έναρξης απαιτείται"),
  vacationDays: yup.number().required("Οι ημέρες διακοπών απαιτούνται"),
  salary: yup.number().required("Ο μισθός απαιτείται"),
  employmentType: yup.string().required("Ο τύπος απασχόλησης απαιτείται"),
});

const EmployeeForm = () => {
  const params = useParams();
  const [departments, setDepartments] = useState<any[]>([]);
  const navigate = useNavigate();
  const employeeUrl = Important.backEndEmployeeUrl;
  const departmentGetAll = Important.getAllDepartment;
  const [formTitle, setFormTitle] = useState<string>('');
  const [employeeCurrentDepartmentId, setEmployeeCurrentDepartmentId] = useState<any | null >(null);
  const [employeeSelectedDepartmentId, setEmployeeSelectedDepartmentId] = useState<any>('');
  


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
    if (!params?.id) {
      try {
        response = await axios.put(employeeUrl, data);
        toast.success('Ο εργαζόμενος δημιουργήθηκε επιτυχώς');
        success = true;
      } catch (error) {
        toast.error('Αποτυχία δημιουργίας εργαζόμενου');
      }
    } else {
      try {
         response = await axios.patch(`${employeeUrl}/${params?.id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Επιτυχής ενημέρωση εργαζόμενου");
        success = true;

      } catch (error) {
        toast.error('Αποτυχία ενημέρωσης εργαζόμενου');
      }
    }
    if (success) navigate('/employee/view/'+response.data.id);
  };


  const getEmployee = async () => {
    let text = 'Προσθέστε νέο εργαζόμενο:';
    if (params && params?.id) {
      text = 'Ρυθμίσεις εργαζόμενου:';
      await axios
        .get(`${employeeUrl}/${params?.id}`)
        .then((response) => {
          reset(response.data);
          if (response.data.department.name !== null || response.data.department.name !== null)
            setEmployeeCurrentDepartmentId(response.data.department.id);
          console.log(response.data.isAdmin);
          setValue('isAdmin', response.data.isAdmin);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
    setFormTitle(text);
  }

  const getAllDepartments: any = async () => {
    const requestUrl = departmentGetAll;
    try {
      const response: any = await axios.get(requestUrl);
      setDepartments(response.data);
    }
    catch (error: any) {
      toast.error(error?.response.data.message);
    }

  }

  useEffect(() => {
    getEmployee();
  }, []);

  useEffect(() => {
    getAllDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      let defaultDepartmentId = departments[0].id;
      if (params?.id) {
        defaultDepartmentId = employeeCurrentDepartmentId;
      }
      setEmployeeSelectedDepartmentId(defaultDepartmentId);
    }
  }, [departments]);
  
  return (
    <div>
      {Display.displayIconButton()}
      <h2>{formTitle}</h2>
      <Box
        sx={{
          width: "500px",
        }}
      >
        <form  onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="name"
                label="Όνομα"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="surname"
                label="Επώνυμο"
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
                  label="Κωδικός πρόσβασης"
                />
              </Grid>
            )}
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="employeeUid"
                label="Αριθμός μητρώου"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="startDate"
                label="Ημερομηνία Έναρξης"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="vacationDays"
                label="Ημέρες Διακοπών"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="salary"
                label="Μισθός"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                errors={errors}
                control={control}
                name="employmentType"
                label="Επάγγελμα"
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
                  label="Συμμετοχή στη διαχείριση"
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
            Υποβολή
          </Button>
          <Button
            type="reset"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            style={{ marginLeft: "20px" }}
          >
            Ανανέωση
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default EmployeeForm;
