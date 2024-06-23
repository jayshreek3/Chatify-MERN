import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast, Box, Button} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'; 

const MyChats = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);

  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    if (userInfo) {
      fetchChats();
    }
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Roboto"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >My chats
      <Button
            d="flex" fontFamily="Roboto" padding-left="200px" marginLeft="120px"
            fontSize={{ base: "16px", md: "20px", lg: "17px" }}
            
            
          > <FontAwesomeIcon icon={faPlus} />
              New Group Chat
          </Button>
      </Box>
    </Box>
  );
};

export default MyChats;
