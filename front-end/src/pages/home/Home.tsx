import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {isAccessTokenNotExpired} from "src/useAuth";
import * as Important from "src/important";
import { DisplayGenericTitle } from "src/display";

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const accessTokenCookie = Important.accessTokenCookie;



  useEffect(() => {
    const token = cookies[accessTokenCookie];
    if (!token) 
      navigate('/signIn');
  }, [cookies, navigate, accessTokenCookie]);

  return (
    <div>
      <DisplayGenericTitle text={'Home'}/>
    </div>
  );
};

export default Home;
