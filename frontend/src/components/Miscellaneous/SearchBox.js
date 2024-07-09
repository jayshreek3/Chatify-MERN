import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Tooltip,
  Flex,
  Input,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, Avatar } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SearchBox = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    try {
      console.log("Successfully logged out!");
    } catch (error) {
      console.error(error.message);
    }

    history.push("/"); // Use history.push for navigation
  };

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/user?search=${search}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.error("Error during search:", error.message);
      toast({
        title: "Error occurred!",
        description: error.response?.data?.message || "No user or chat found",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };


      const { data } = await axios.post(`${API_BASE_URL}/api/chat`, { userId }, config);

      if(!chats.find((c) => c._id === data._id))
      setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose(); // to close the side drawer
    } catch (error) {
      console.error("Error during search:", error.message);
      toast({
        title: "Error occurred!",
        description: error.response?.data?.message,
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Box w="100%">
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        bg="white"
        p="5px 10px"
        borderBottomWidth="1px"
      >
        <Text fontSize="2xl" fontFamily="Roboto" textAlign="center">
          Chatify
        </Text>
        <Box paddingLeft="183vh">
          <Menu>{/* Your menu content (commented out for brevity) */}</Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Box
        display="flex"
        justifyContent="left"
        alignItems="center"
        w="100%"
        p="10px"
        borderBottomWidth="0px"
        
      >
        <Tooltip hasArrow placement="bottom-end">
          <Button variant="outline" background={"white"} onClick={onOpen} w={{ base: "100%", md: "31%" }} >
            <i className="fas fa-search" style={{ alignItems: "left" }}></i>
            <Text display={{ base: "100%", md: "flex" }} px={4}>
              Search or start a new chat
            </Text>
          </Button>
        </Tooltip>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for users</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Search for users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <Button onClick={handleSearch}>Go</Button> */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="yellow" onClick={handleSearch}>
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SearchBox;
