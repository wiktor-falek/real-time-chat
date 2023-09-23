import Message from "../entities/message.js";
import MessageModel from "../models/messageModel.js";
import type { ObjectId } from "mongodb";
import { getChannelId } from "../utils/id.js";

class MessageService {
  /**
   * Sends a message to a channel between two users.
   */
  static async sendDirectMessage(
    senderId: string,
    recipientId: string,
    content: string
  ) {
    const channelId = getChannelId(senderId, recipientId);
    const message = new Message(senderId, content);
    return MessageModel.sendToChannel(channelId, message);
  }

  /**
   * Retrieve messages from a channel, optionally specify amount of messages,
   * or appearing before a certain messageId for pagination.
   */
  static async getMessagesFromChannel(
    channelId: string,
    options: { amount?: number; lastMessageId?: string | ObjectId }
  ) {
    const { amount = 30, lastMessageId } = options;
    return MessageModel.getMessages(channelId, amount, lastMessageId);
  }
}

export default MessageService;
