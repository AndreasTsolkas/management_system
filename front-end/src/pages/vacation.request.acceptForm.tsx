import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MuiTextField from "../components/MuiTextField";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from 'moment';

// create schema validation
const schema = yup.object({
  vacationId: yup.number().required("vacation id is required"),
  status: yup.string().required("status is required")
});

const VacationRequestAcceptForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  


  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      vacationId: "",
      status: ""
      
    },
    resolver: yupResolver(schema),
  });



  const onSubmit = (data: any) => {
    const resultDiv: any = document.getElementById("result");
      axios.put("http://localhost:8081/api/vacation/approverequest", data, {
        headers: { "Content-Type": "application/json" }
      })
        .then((response) => {
          resultDiv.textContent = `Data: ${JSON.stringify(response.data)}`;
          toast.success("Vacation request is approved.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    
  };

  return (
    <div>
      <h1>Complete </h1>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
        <MuiTextField
            errors={errors}
            control={control}
            name="vacationId"
            label="vacationId"
          />
          <MuiTextField
            errors={errors}
            control={control}
            name="status"
            label="status"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
      <div id="result"></div>
    </div>
  );
};

export default VacationRequestAcceptForm;
