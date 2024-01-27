import React, { useEffect } from 'react';
import * as Cookies from 'src/cookies';


const ScheduledTasks = () => {

  useEffect(() => {

    const intervalId = setInterval(Cookies.cookiesValidation, 300000); 

    return () => clearInterval(intervalId);
  }, []); 

  return (<div></div>);


};

export default ScheduledTasks;