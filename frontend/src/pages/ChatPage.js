import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SearchBox from "../components/Miscellaneous/SearchBox";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  // const [chats, setChats] = useState([]);

  // useEffect(() => {
  //     const fetchChats = async () => {
  //         try{
  //             const response = await axios.get("api/chat");
  //             setChats(response.data);
  //         }
  //         catch(error){
  //             console.error("Error fetching chats:", error);
  //         }

  //     };

  //     fetchChats();

  // }, []); // Empty dependency array means this effect runs once on component mount
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  


  return (
    <div style={{ width: "100%" }}>
      {user && <SearchBox/>}
      <Box overflow="hidden" display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
