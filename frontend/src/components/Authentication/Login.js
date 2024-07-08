import React, { useState } from 'react';
import {
  VStack,
  StackDivider,
  FormControl,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import backendAPI from '../../backendAPI';
const API_BASE_URL = process.env.API_BASE_URL;
const Login = () => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClickPassword = () => setShowPassword(!showPassword);

  const submitForm = async () => {
    console.log("setLoading type:", typeof setLoading);
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      //setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing="5px"
      align="stretch"
    >
      
        <FormControl id="email" isRequired>
          <FormLabel>Email Id</FormLabel>
          <Input
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <InputRightElement width="4.5rem">
              <Button h="1rem" onClick={handleClickPassword}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      

      <Button
        colorScheme="yellow"
        width="50%"
        alignSelf="center" marginBottom="10px"
        style={{ marginTop: 20 }}
        onClick={submitForm}
      >
        Login
      </Button>

      <Button variant="solid" colorScheme='blue' alignSelf="center" marginTop="13px" width="50%" onClick={()=>{setEmail("guest@example.com"); setPassword("123456")}}>
        Continue as Guest
      </Button>
    </VStack>
  )
}

export default Login;
