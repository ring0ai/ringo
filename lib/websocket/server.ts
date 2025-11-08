import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import z from "zod";
import { conversationHandler } from "./handlers/conversationHandler";


// @dev: The type default is set to call because twilio can't send query parameter 
const websocketParamsSchema = z.object({
  type: z.enum(["call"]).optional().default("call"),
});

export const setupWebsocketServer = (server: Server) => {
  const websocketServer = new WebSocketServer({
    server,
    path: "/api/socket",
    verifyClient: (info: any) => {
      return true;
    },
  });

  websocketServer.on("connection", async (ws: WebSocket, req: any) => {
    console.log("🔌 New WebSocket connection established");

    // Extract query parameters from request
    const decodedUrl = req.url!.replace(/&amp;/g, '&')
    console.log(`Decoded url => ${decodedUrl}`)
    const url = new URL(decodedUrl, `http://${req.headers.host}`);
    const result = websocketParamsSchema.safeParse(
      Object.fromEntries(url.searchParams.entries())
    );
    if (!result.success) {
      console.error("Invalid websocket parameters:", result.error);
      ws.close(1000, "Invalid websocket parameters");
      return;
    }
    const params: z.infer<typeof websocketParamsSchema> = result.data;
    console.log("🔌 New WebSocket connection established:", params);
    ws.send(
      JSON.stringify({
        type: "connected",
        message: "WebSocket connected successfully",
      })
    );

    switch (params.type) {
      case "call":
        conversationHandler(ws, req);
        break;
      default:
        console.log("Unknown type:", params.type);
        ws.close(1000, "Unknown type");
    }
  });

  return websocketServer;
};
