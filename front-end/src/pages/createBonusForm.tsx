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
import * as Important from "src/important";
import * as Display from "src/display";

// create schema validation
const schema = yup.object({
  employeeId: yup.number().required("Η συμππλήρωση του user id είναι απαραίτητη."),
  season: yup.string().required("Η συμπλήρωση της εποχής που ο εργαζόμενος θα πάρει το bonus είναι απαραίτητη.")
});

const CreateBonusForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const bonusUrl = Important.backEndBonusUrl;


  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      employeeId: "",
      season: ""
    },
    resolver: yupResolver(schema),
  });



  const onSubmit = (data: any) => {
    const resultDiv = document.getElementById("result");
    const requestUrl = bonusUrl+`/create/bonus`;
    const putData = {
      employeeId: data.employeeId,
      season: data.season,
    };
    if (resultDiv) {
      axios.put(requestUrl, putData)
        .then((response) => {
          resultDiv.textContent = `Data: ${JSON.stringify(response.data)}`;
          toast.success("Bonuses created.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div>
      <h2>Δημιουργία bonus: </h2>
      <Box
        sx={{
          width: "200px",
        }}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
        <MuiTextField
            errors={errors}
            control={control}
            name="employeeId"
            label="employeeId"
          />
          <MuiTextField
            errors={errors}
            control={control}
            name="season"
            label="season"
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
      <div id="result"></div>
    </div>
  );
};

export default CreateBonusForm;