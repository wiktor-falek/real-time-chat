import type { Message } from "../domains/channels/interfaces/message.js";
import type { UserProfile, UserStatus } from "../domains/users/index.js";

export type ServerToClientEvents = {
  error: { reason: string };
  clientId: string;
  "chat:message": Message;
  "subscription:user-profile:status": { profileId: string; status: UserStatus };
  "relation:friend-invite": { profile: UserProfile };
};
