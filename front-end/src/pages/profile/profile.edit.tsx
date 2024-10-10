
import { useNavigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";

import * as Important from "src/important";
import {hasAccessAuth} from "src/useAuth";



const EditProfileForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const employeeUrl = Important.employeeUrl;
  const [employeeId, setEmployeeId] = useState<any>(1);

  const [employeePageUrl, setEmployeePageUrl] = useState<string>('');

  hasAccessAuth();
  

  function catchAndSetEmployeeId() {
    if (params?.id) setEmployeeId(params?.id)
    else navigate('/');
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
  }, [employeeId]);

  useEffect(() => {
    if(employeePageUrl) 
      navigate(employeePageUrl);
  }, [employeePageUrl, navigate]);



  return (
    <h2></h2>
  )
};

export default EditProfileForm;
