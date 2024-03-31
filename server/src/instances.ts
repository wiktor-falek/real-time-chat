import { RelationshipControllerHTTP } from "./controllers/index.js";
import Mongo from "./db/mongo.js";
import Redis from "./db/redis.js";
import { FriendInviteModel, RelationModel } from "./models/index.js";
import { NotificationService, RelationshipService } from "./services/index.js";
import { ProfileSubscriptionStore } from "./stores/index.js";
import {
  ChatControllerWS,
  ProfileSubscriptionControllerWS,
} from "./websocket/controllers/index.js";

import {
  AuthControllerHTTP,
  AuthService,
  SessionStore,
} from "./domains/auth/index.js";
import {
  ChannelControllerHTTP,
  ChannelModel,
  MessageControllerHTTP,
  MessageService,
} from "./domains/channels/index.js";
import {
  StatusControllerHTTP,
  StatusService,
  UserControllerHTTP,
  UserModel,
  UserService,
} from "./domains/users/index.js";

// Database connections
const [redisClient, mongoClient] = await Promise.all([
  new Redis("redis://localhost:6379").connectOrThrow(),
  new Mongo("mongodb://localhost:27017").connectOrThrow(),
]);

// Databases
export const mongoDb = mongoClient.db("bonfire");

// Stores
export const sessionStore = new SessionStore(redisClient);
export const profileSubscriptionStore = new ProfileSubscriptionStore();

// Models
export const userModel = new UserModel(mongoDb);
export const channelModel = new ChannelModel(mongoDb);
export const friendInviteModel = new FriendInviteModel(mongoDb);
export const relationModel = new RelationModel(mongoDb);

// Services
export const notificationService = new NotificationService();
export const authService = new AuthService(userModel, sessionStore);
export const messageService = new MessageService(channelModel);
export const userService = new UserService(userModel);
export const statusService = new StatusService(
  userModel,
  profileSubscriptionStore
);
export const relationshipService = new RelationshipService(
  userModel,
  friendInviteModel,
  relationModel,
  userService,
  notificationService
);

// HTTP Controllers
export const authControllerHTTP = new AuthControllerHTTP(authService);
export const userControllerHTTP = new UserControllerHTTP(userService);
export const channelControllerHTTP = new ChannelControllerHTTP(
  channelModel,
  userService
);
export const messageControllerHTTP = new MessageControllerHTTP(messageService);
export const relationshipControllerHTTP = new RelationshipControllerHTTP(
  relationshipService
);
export const statusControllerHTTP = new StatusControllerHTTP(statusService);

// WS Controllers
export const chatControllerWS = new ChatControllerWS(messageService);
export const profileSubscriptionControllerWS =
  new ProfileSubscriptionControllerWS(profileSubscriptionStore);
