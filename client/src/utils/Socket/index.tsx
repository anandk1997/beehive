import { io } from "socket.io-client";
import { SOCKET_URL } from "src/env";

export const socket = io(SOCKET_URL);
