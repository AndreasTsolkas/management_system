import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import MuiTextField from "../../components/MuiTextField";
import axios from "axios";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";
import EmployeeForm from "src/pages/employee/EmployeeForm";



const EditProfileForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const [employeeId, setEmployeeId] = useState<any>(1);
  const [formTitle, setFormTitle] = useState<string>('');

  const [employeePageUrl, setEmployeePageUrl] = useState<string>('');

  hasAccessAuth();
  isAdminAuth();
  

  function catchAndSetEmployeeId() {
    if (params?.id) setEmployeeId(params?.id);
  }

  function setEmployeePage() {
    let pageUrl = employeeUrl+'/'+Important.editLinkBase+employeeId+'/true';
    setEmployeePageUrl(pageUrl);
  }


  useEffect(() => {
    catchAndSetEmployeeId();
  }, []);

  useEffect(() => {
    setEmployeePage();
  }, []);

  useEffect(() => {
    console.log("here" , employeePageUrl);
    if(employeePageUrl) 
      navigate(employeePageUrl);
  }, [employeePageUrl, navigate]);

  console.log(params.id);


  
  return (
    <div>

    </div>
  );
};

export default EditProfileForm;
