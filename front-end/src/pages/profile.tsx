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
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { Season } from "src/enums/season";
import { useState, useEffect } from 'react';


const UserProfile = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const employeeUrl = Important.backEndEmployeeUrl;

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
  });

  const getEmployeeProfile =  async () => {
    const requestUrl=employeeUrl+'';
    try {
      const response = await axios.get(requestUrl);
      setEmployees([response.data]);

    }
    catch(error: any) {
      console.error(error);
      toast.error(error?.response.data.message);
    }
  }

  useEffect(() => {

  }, []);

  console.log(employees);


  return (
    <div>

    </div>
  );
};

export default UserProfile;