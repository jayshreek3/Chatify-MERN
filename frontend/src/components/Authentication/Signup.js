import {
  VStack,
  Box,
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
import { useState } from "react";
import { useHistory } from "react-router-dom";
const API_BASE_URL = process.env.API_BASE_URL;
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/dns8igq6z/image/upload";

  const handleClickPassword = () => setShowPassword(!showPassword);
  const handleClickConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const postPicture = (picture) => {
    setLoading(true);
    if (picture === undefined || picture.length === 0) {
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            Please Select an Image
          </Box>
        ),
      });
      setLoading(false);
      return;
    }

    const pic = picture[0];
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");

      fetch(cloudinaryUrl, {
        method: "POST",
        body: data,
      })
        .then((res) => {
          console.log("Cloudinary Response Status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Cloudinary Response Data:", data);
          if (data.secure_url) {
            setPhoto(data.secure_url.toString());
            setLoading(false);
            toast({
              position: "bottom-left",
              render: () => (
                <Box color="white" p={3} bg="blue.500">
                  Profile Picture Set!
                </Box>
              ),
            });
          } else {
            throw new Error("Upload failed");
          }
        })
        .catch((err) => {
          console.error("Upload Error:", err);
          setLoading(false);
          toast({
            position: "bottom-left",
            render: () => (
              <Box color="white" p={3} bg="red.500">
                Upload Failed, Please ensure the size is less than 100KB
              </Box>
            ),
          });
        });
    } else {
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            Please Select an Valid Image (PNG/ JPEG)
          </Box>
        ),
      });
      setLoading(false);
      return;
    }
  };

  const SubmitForm = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/api/user`,
        { name, email, password, photo },
        config
      );
      console.log("User Data:", data);
      toast({
        title: `Account Created Successfully. Welcome Aboard ${name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');

    } catch (error) {
      toast({
        title: "An error occurred",
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
    <Box  pb={1}>
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing="5px"
      align="stretch"
    >
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Id</FormLabel>
        <Input
          placeholder="Enter email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1rem" onClick={handleClickPassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Please confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1rem" onClick={handleClickConfirmPassword}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="photo">
        <FormLabel>Upload a Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          placeholder="Set a profile picture"
          onChange={(e) => postPicture(e.target.files)}
        />
      </FormControl>
      <Button
        colorScheme="yellow"
        width="50%"
        alignSelf="center"
        style={{ marginTop: 20 }}
        onClick={SubmitForm}
        isLoading={loading}
      >
        Create account
      </Button>
    </VStack>
    </Box>
  );
};

export default Signup;
