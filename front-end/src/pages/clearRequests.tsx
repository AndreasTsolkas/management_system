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
  pending: yup.boolean().required("pending is required"),
  rejected: yup.boolean().required("rejected is required")
});

const DeleteRequestsForm = () => {
  const params = useParams();
  const navigate = useNavigate();


  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      pending: false,
      rejected: false
    },
    resolver: yupResolver(schema),
  });



  const onSubmit = (data: any) => {
    const { pending, rejected } = data;

    if (!pending && !rejected) {
      toast.error("Please select at least one checkbox.");
      return;
    }
  
    // If both checkboxes are checked, send two separate requests
    if (pending && rejected) {
      Promise.all([
        axios.delete(`http://localhost:8081/api/vacation/clear?pending=true`),
        axios.delete(`http://localhost:8081/api/vacation/clear?pending=false`)
      ])
        .then((responses) => {
          toast.success("Vacation requests are cleared.");
          navigate("/vacation_request");
        })
        .catch((errors) => {
          console.error(errors);
          toast.error(errors.response.data.message);
        });
    } else {
      const pendingValue = pending ? true : false;
  
      axios.delete(`http://localhost:8081/api/vacation/clear?pending=${pendingValue}`)
        .then((response) => {
          const message = pending
            ? "Pending vacation requests cleared."
            : "Rejected vacation requests cleared.";
  
          toast.success(message);
          navigate("/Vacation_request");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div>
      <h1>Clear</h1>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input type="checkbox" {...control.register("pending")} />
            <label>Pending</label>
          </div>
          <div>
            <input type="checkbox" {...control.register("rejected")} />
            <label>Rejected</label>
          </div>
          
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Delete
          </Button>
        </form>
      </Box>
      <div id="result"></div>
    </div>
  );
};

export default DeleteRequestsForm;