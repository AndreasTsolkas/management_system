import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
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
    <div className="standart-page">
      <DisplayGenericTitle text={'Home'}/>
    </div>
  );
};

export default Home;
