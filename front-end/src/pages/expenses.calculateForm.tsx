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
  companyId: yup.number().required("company id is required"),
});

const CalculateExpensesForm = () => {
  const params = useParams();
  const navigate = useNavigate();


  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      companyId: "",
      
    },
    resolver: yupResolver(schema),
  });



  const onSubmit = (data: any) => {
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      axios.get(`http://localhost:8081/api/company/expenses/${data.companyId}`)
        .then(response => {
          resultDiv.textContent = `Expenses: ${response.data}`;
          console.log(response.headers);
          toast.success("Expenses calculated successfully.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  };
  
  return (
    <div>
      <h1>Calculate  </h1>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
        <MuiTextField
            errors={errors}
            control={control}
            name="companyId"
            label="companyId"
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

export default CalculateExpensesForm;
