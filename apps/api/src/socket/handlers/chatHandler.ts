import type { WebSocket } from "ws";
import { broadcastSend, send } from "../utils.js";
import { messageService } from "../../instances.js";
import { z } from "zod";

const sendDirectMessageSchema = z
  .object({
    recipientId: z.string(),
    content: z.string(),
  })
  .strict();

export async function directMessageHandler(
  ws: WebSocket,
  userId: string,
  data: any
) {
  const validation = sendDirectMessageSchema.safeParse(data);
  if (!validation.success) {
    return send(ws, "error", { reason: "Invalid Schema" });
  }

  const { recipientId, content } = validation.data;

  // TODO: move outside of DMs
  // const participantChannels = await channelModel.findAllChannelIdsByUserId(
  //   userId
  // );

  // if (!participantChannels.includes(channelId)) {
  //   send(ws, "error", { reason: "Not Authorized" });
  // }

  const result = await messageService.sendDirectMessage(
    userId,
    recipientId,
    content
  );

  if (!result.ok) {
    send(ws, "error", { reason: "Failed to send the message" });
    return;
  }

  const message = result.val;

  broadcastSend(ws, "chat:message", message);
}
