import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast, Box, Button, Stack, Text} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'; 
import ChatLoading from "../components/ChatLoading";
import { getSender } from "../config/ChatLogic";
import { GroupChatModal } from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
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
  }, [fetchAgain ]);

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
      <GroupChatModal><Button
            d="flex" fontFamily="Roboto" padding-left="200px" marginLeft="120px"
            fontSize={{ base: "16px", md: "20px", lg: "17px" }}
            
            
          > <FontAwesomeIcon icon={faPlus} />
              New Group Chat
          </Button></GroupChatModal>
      
      </Box>
      <Box  d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="90%"
        borderRadius="lg"
        overflowY="hidden">
          {chats ? (
          <Stack overflowY="hidden">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#e1ad01" : "#E8E8E8"}
                color={selectedChat === chat ? "black" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
