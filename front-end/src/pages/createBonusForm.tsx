import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { Season } from "src/enums/season";
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router";





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

const CreateBonusForm = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const bonusUrl = Important.backEndBonusUrl;
  const employeeGetAll = Important.getAllEmployee;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: "",
      season: "",
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const requestUrl = bonusUrl + `/create/bonus`;
    const putData = {
      employeeId: data.employeeId,
      season: data.season,
    };
      axios
        .put(requestUrl, putData)
        .then((response) => {
          toast.success("Το bonus δημιουργήθηκε με επιτυχία.");
          navigate('/bonus/view/'+response.data.id);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
  };

  const getAllEmployees =  async () => {
    const requestUrl = employeeGetAll;
    try {
      const response = await axios.get(requestUrl);
      setEmployees(response.data);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  useEffect(() => {
    getAllEmployees();
  }, []);



  return (
    <div>
      {Display.displayIconButton()}
      <h2>Δημιουργία bonus: </h2>
      <div>
      <Box display="flex">
      <Box sx={{ width: "250px" }}>
        <form  noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <div>
                <InputLabel htmlFor="employee-label">Εργαζόμενος</InputLabel>
                <Select
                  {...field}
                  labelId="employee-label"
                  id="employee-label"
                  fullWidth
                  variant="outlined"
                >
                  {employees.map((item: any) => {
                    let departmentNameValue: any = '-----';
                    if(item.department !==null) departmentNameValue = item.department.name;
                    return (
                    <MenuItem key={item.id} value={item.id}>
                       {item.name} {item.surname}, {departmentNameValue}, {item.salary}$ μισθός, 
                    </MenuItem>
                    );
                  })} 
                </Select>
                <span style={{ color: "red" }}>{errors.employeeId?.message}</span>
              </div>
            )}
          />

          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <div style={{marginTop:"10px"}}>
                <InputLabel htmlFor="season-label">Εποχή</InputLabel>
                <Select
                  {...field}
                  labelId="season-label"
                  id="season-label"
                  fullWidth
                  variant="outlined"
                  
                >
                  {Object.entries(Season).map(([name, value]) => (
                    
                    <MenuItem key={name} value={name}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <span style={{ color: "red" }}>{errors.season?.message}</span>
              </div>
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Υποβολή
          </Button>
        </form>
      </Box>
      </Box>
      </div>
      <div id="result"></div>
    </div>
  );
};

export default CreateBonusForm;