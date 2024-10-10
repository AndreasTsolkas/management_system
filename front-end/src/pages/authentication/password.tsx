
import { useForm } from "react-hook-form";
import {
  Box,
  Button
} from "@mui/material";
import { toast } from "react-toastify";
import * as Important from "src/important";
import * as Display from "src/display";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import {hasAccessAuth} from "src/useAuth";
import {httpClient} from "src/requests";
import MuiTextField from "src/components/MuiTextField";
import { useParams } from "react-router-dom";
import { DisplaySmallGenericTitle } from "src/display";




const PasswordForm = () => {
  const params = useParams();
  const profileUrl = Important.profileUrl;
  const [isCurrentPasswordValidated, setIsCurrentPasswordValidated] = useState<boolean>(false);
  const [passwordChangedSuccessfully, setPasswordChangedSuccessfully] = useState<boolean>(false);
  const defaultFormTitleText = 'Validate current password:';
  const [formTitle, setFormTitle] = useState<string>(defaultFormTitleText);
  const employeeId = params?.id;



  hasAccessAuth();

  

  
  const {
    
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    },
  });

  const navigate = useNavigate();


  const onReset = () => {
    reset({
      oldPassword: "",
      newPassword: ""
    });
    setIsCurrentPasswordValidated(false);
    setPasswordChangedSuccessfully(false);
    setFormTitle(defaultFormTitleText);
  };

  const onPasswordValidation = async (data: any) => {
    const requestUrl = profileUrl + '/checkpassword/'+employeeId;
    const postData = {
      password: data.oldPassword
    };
    
      await httpClient
        .post(requestUrl, postData)
        .then((response) => {
          toast.success("The password you sent is valid. You are ready to set your new password.");
          setIsCurrentPasswordValidated(true);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
  };

  const onPasswordChange = async (data: any) => {
    const requestUrl = profileUrl + '/updatepassword/'+employeeId;
    const patchData = {
      newpassword: data.newPassword
    };
      await httpClient
        .patch(requestUrl, patchData)
        .then((response) => {
          toast.success("Your password changed successfully.");
          setPasswordChangedSuccessfully(true);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
  };

  const onSubmit = async (data: any) => {
    try {
      if (!isCurrentPasswordValidated) await onPasswordValidation(data); 
      else await onPasswordChange(data);
    } catch (error) {
      console.error(error);
    }
  };

  function updateFormTitle() {
    if(isCurrentPasswordValidated) 
      setFormTitle('Enter your new password:');
  }






  useEffect(() => {
    updateFormTitle();
  }, [isCurrentPasswordValidated]);




  return (
    <div className="standart-page">
      {Display.DisplayIconButton()}
      <div >
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box sx={{ width: "300px" }}>
        
        {!passwordChangedSuccessfully ? (
            
  <form  onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
    <div style={{marginBottom: '15px', marginTop:'15px'}}>
    <DisplaySmallGenericTitle text= {formTitle} />
    </div>
    {!isCurrentPasswordValidated ? (
  <>
    <MuiTextField
      errors={errors}
      control={control}
      name="oldPassword"
      label="Password"
    />
  </>
) : (
    <MuiTextField
    errors={errors}
    control={control}
    name="newPassword"
    label="New password"
  />
)}
    
    <Button
      type="submit"
      variant="contained"
      sx={{ mt: 1, mb: 2 }}
    >
      Submit
    </Button>
    <Button
      type="reset"
      sx={{ mt: 1, mb: 2 }}
      style={{ marginLeft: "20px" }}
      variant="outlined"
    >
      Reset
    </Button>
  </form>
) : (
  <h3>Password changed successfully.</h3>
)}
      </Box>
      </Box>
      </div>
    </div>
  );
};

export default PasswordForm;