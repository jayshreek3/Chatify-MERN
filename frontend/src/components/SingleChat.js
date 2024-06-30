import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Spacer, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./Miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../config/ChatLogic";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Roboto"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            
            <IconButton
              d={{ base: "flex", md: "none" }} 
              
              icon={<ArrowBackIcon />}
              
              onClick={() => setSelectedChat("")}
            />
            
            
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  // fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box  display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="91%"
            borderRadius="lg"
            overflowY="hidden">
            
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100vh"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Roboto">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
