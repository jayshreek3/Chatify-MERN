import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SearchBox from "../components/Miscellaneous/SearchBox";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

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
  const { user } = ChatState();


  return (
    <div style={{ width: "100%" }}>
      {user && <SearchBox/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
