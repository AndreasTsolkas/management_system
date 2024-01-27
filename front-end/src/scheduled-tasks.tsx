import React, { useEffect } from 'react';
import * as Cookies from 'src/cookies';


const ScheduledTasks = () => {

  useEffect(() => {

    const intervalId = setInterval(Cookies.cookiesValidation, 5000); 

    return () => clearInterval(intervalId);
  }, []); 

  return (<div></div>);


};

export default ScheduledTasks;