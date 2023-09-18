	

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import { IPost } from "./user.model";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Important from "src/important";
import * as Display from "src/display";

// create schema validation
export const BonusSchema = yup.object({

  employeeId: yup.object().shape({
    id: yup.number().required("Employee id is required!")
  }),
  companyId: yup.object().shape({
    id: yup.number().required("Company id is required!")
  }),

  amount: yup.number().required("Number id is required!")

  
})
const BonusForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const bonusUrl = Important.backEndBonusUrl;


  useEffect(() => {
    if (params && params?.id) {
      axios
        .get(`${bonusUrl}/${params?.id}`)
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
       departmentId: {id: ""},
       amount: ""
     },
    resolver: yupResolver(BonusSchema),
  });

  const onSubmit = async (data: any) => {
    try {
        if (!params?.id) {
            await axios.post(bonusUrl, data);
            toast.success("Employee Product created succesfully");
        } else {
          await axios.put(`${bonusUrl}/${params?.id}`, data, {
            headers: { "Content-Type": "application/json" }
          });
            toast.success("Bonus updated");
        }
        navigate(-1);
    } catch (error) {
        toast.error("Bonus couldn't be created/updated!");
    }
};

  return (
    <div>
      
      {Display.displayIconButton()}

      <h2>Προσθέστε νέο bonus:</h2>
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
            {...register('departmentId.id')}
            errors={errors}
            control={control}
            name="companyId.id"
            label="companyId Id"
          />
          <MuiTextField
            {...register('amount')}
            errors={errors}
            control={control}
            name="amount"
            label="amount"
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

export default BonusForm;
