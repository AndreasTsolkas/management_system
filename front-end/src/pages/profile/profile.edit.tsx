import * as yup from "yup";
import { useNavigate, useParams, useLocation   } from "react-router-dom";
import { useEffect, useState } from "react";

import * as Important from "src/important";
import * as Display from "src/display";
import {hasAccessAuth, isAdminAuth, isAccessTokenNotExpired} from "src/useAuth";
import { httpClient } from "src/requests";



const EditProfileForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const [employeeId, setEmployeeId] = useState<any>(1);

  const [employeePageUrl, setEmployeePageUrl] = useState<string>('');

  hasAccessAuth();
  

  function catchAndSetEmployeeId() {
    if (params?.id) setEmployeeId(params?.id);
  }

  function setEmployeePage() {
    let pageUrl = employeeUrl+'/'+Important.editLinkBase+employeeId+'/true';
    setEmployeePageUrl(pageUrl);
  }

  const location = useLocation();

  // Access the location object to get information about the current location
  console.log('Current Location:', location);


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
