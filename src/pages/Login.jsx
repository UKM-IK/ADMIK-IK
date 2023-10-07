import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import instance from "../axiosInstance";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
 
export default function Login({setUser}) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/login', {username, password});
      console.log(response.data);
      const dataUser = jwtDecode(response.data.token);
      setUser({
        id: dataUser.sub,
        role: dataUser.role,
      });

      Cookies.set('userToken', btoa(response.data.token));
      Cookies.set('userInfo', JSON.stringify({
        id: dataUser.sub,
        role: dataUser.role,
      }));

      navigate("/dashboard/overview", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Sign In
        </Typography>
      </CardHeader>
      <form onSubmit={handleSignIn}>
      <CardBody className="flex flex-col gap-4">
        <Input label="Username" size="lg" type="text" onChange={handleUsernameChange} />
        <Input label="Password" size="lg" type="password" onChange={handlePasswordChange} />
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth type="submit">
          Sign In
        </Button>
      </CardFooter>
      </form>
    </Card></div>
  );
}