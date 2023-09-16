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
  companyId: yup.string().required("company id is required"),
  status: yup.string().required("status is required"),
  startDate: yup
    .string()
    .test(
      "is-utc-date",
      "start date must be a valid UTC date",
      (value) => moment.utc(value, true).isValid()
    )
    .required("start date is required"),
  endDate: yup
    .string()
    .test(
      "is-utc-date",
      "end date must be a valid UTC date",
      (value) => moment.utc(value, true).isValid()
    )
    .required("end date is required")
});

const VacationRequestByCompanyForm = () => {
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
      status: "",
      startDate: "",
      endDate: "",
      
    },
    resolver: yupResolver(schema),
  });



  const onSubmit = (data: any) => {
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      axios.post("http://localhost:8081/api/vacation/getrequestbycompany", data)
        .then((response) => {
          resultDiv.textContent = `Data: ${JSON.stringify(response.data)} `;
          toast.success("Vacation requests are retrieved.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
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
            name="companyId"
            label="companyId"
          />
          <MuiTextField
            errors={errors}
            control={control}
            name="status"
            label="status"
          />
          <MuiTextField
            errors={errors}
            control={control}
            name="startDate"
            label="startDate"
          />
          <MuiTextField
            errors={errors}
            control={control}
            name="endDate"
            label="endDate"
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

export default VacationRequestByCompanyForm;
