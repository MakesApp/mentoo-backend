
import Conversation from "../components/conversations/conversation.model"
export const fetchUsersWithUnreadMessages = async (userArray) => {
  
  const users = await Promise.all(
    userArray.map(async (user) => {
      const conversation = await Conversation.findOne({ users: user._id }).populate("transcript.sender");

      if (!conversation) {
          return {
            ...user.toObject(),
            hasUnreadMessages: false,
          };
      }

      const unreadMessages = conversation?.transcript.filter((message) => !message.seenBy);

        return {
          ...user.toObject(),
          hasUnreadMessages: unreadMessages ? unreadMessages.length > 0 : false,
        };
    })
  );

  return users;
};
