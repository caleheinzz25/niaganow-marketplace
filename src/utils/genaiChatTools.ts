import axios from "axios";

export const genaiChatTools = async (
  authToken: string,
  message: string,
  mode: "chat" | "order" = "chat"
): Promise<string> => {
  console.log(mode);
  const res = await axios.post("http://localhost:3000/genai", {
    authToken,
    message,
    mode
  });
  return await res.data.response as string;
};
