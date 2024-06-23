import { createContext, useContext , useEffect, useState} from "react";
//import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {

    const [user, setUser] = useState();
    const[selectedChat, setSelectedChat] = useState(); // chats accessible for the whole app, not just when searched and selected for
    const[chats, setChats] = useState([]); // to populate all of the current chats
    const history = useHistory();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            history.push('/');
        }
    },[history]); // whenever there are any changes in history, it gets modified accordingly 

  return <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats}}>{children}</ChatContext.Provider>;
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
// Removed Strict mode and added ChatContext in index.js, so its accessible to whole of the app
// hook- useContext



