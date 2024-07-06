import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender } from '../config/ChatLogic'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'

const ScrollableChat = ({messages}) => {
    const { user } = ChatState();

  return (
    <ScrollableFeed>
        {messages && 
           messages.map((m, i) => (
            <div style={{ display: 'flex', alignItems: 'center',justifyContent: m.sender._id === user._id ? 'flex-end' : 'flex-start' }} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={-6}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                marginLeft: m.sender._id !== user._id ? '30px' : '0px', // Consistent left margin for non-user messages
               marginRight: m.sender._id === user._id ? '10px' : '30px',
                marginTop: '10px', // Consistent top margin
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '70%',
              }}
            >
              {m.content}
            </span>

            </div>

        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat