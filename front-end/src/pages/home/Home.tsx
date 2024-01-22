import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) 
      navigate('/signIn');
  }, []);

  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};

export default Home;
