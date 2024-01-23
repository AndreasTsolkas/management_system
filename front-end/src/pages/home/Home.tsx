import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import * as Important from "src/important";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const accessTokenCookie = Important.accessTokenCookie;

  useEffect(() => {
    const token = cookies[accessTokenCookie];
    console.log(token);
    if (!token) 
      navigate('/signIn');
  }, [cookies, navigate, accessTokenCookie]);

  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};

export default Home;
