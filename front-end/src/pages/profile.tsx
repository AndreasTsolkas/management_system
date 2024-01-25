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


  useEffect(() => {

  }, []);




  return (
    <div>

    </div>
  );
};

export default UserProfile;