	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IPost } from "./vacationRequest.model";
import * as Important from "src/important";
import * as Display from "src/display";

export const VacationRequestSchema = yup.object({

  employeeId: yup.object().shape({
    id: yup.number().required("Employee id is required!")
  }),

  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
  status: yup.string().required("Status is required"),
  days: yup.number().required("Days is required"),


  
})
const VacationRequestForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const vacationRequestUrl = Important.backEndVacationRequestUrl;


  useEffect(() => {
    if (params && params?.id) {
      axios
        .get(`${vacationRequestUrl}/${params?.id}`)
        .then((response) => {
          reset(response.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {

       employeeId: {id: ""},
       
       startDate: "",
       endDate: "",
       status: "",
       days: "",

     },
    resolver: yupResolver(VacationRequestSchema),
  });

  const onSubmit = async (data: any) => {
    try {
        if (!params?.id) {
            await axios.post(vacationRequestUrl, data);
            toast.success("Vacation request created succesfully");
        } else {
          await axios.put(`${vacationRequestUrl}/${params?.id}`, data, {
            headers: { "Content-Type": "application/json" }
          });
            toast.success("Vacation request updated");
        }
        navigate(-1);
    } catch (error) {
        toast.error("Vacation request couldn't be created/updated!");
    }
};

  return (
    <div>
      
      {Display.displayIconButton()}

      <h2>Προσθέστε νεά αίτηση άδειας:</h2>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
          <MuiTextField
            {...register('employeeId.id')}
            errors={errors}
            control={control}
            name="employeeId.id"
            label="Employee Id"
          />
          
          <MuiTextField
            {...register('startDate')}
            errors={errors}
            control={control}
            name="startDate"
            label="startDate"
          />
          <MuiTextField
            {...register('endDate')}
            errors={errors}
            control={control}
            name="endDate"
            label="endDate"
          />
          <MuiTextField
            {...register('status')}
            errors={errors}
            control={control}
            name="status"
            label="status"
          />
          <MuiTextField
            {...register('days')}
            errors={errors}
            control={control}
            name="days"
            label="days"
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

export default VacationRequestForm;
