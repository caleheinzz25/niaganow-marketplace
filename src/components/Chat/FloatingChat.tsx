import { createSignal, onMount, For, Show } from "solid-js";
import { AuthContextType } from "~/types/auth";
import { genaiChatTools } from "~/utils/genaiChatTools";
import { marked } from "marked";
interface Props {
  context: AuthContextType;
}

export const FloatingChat = ({ context }: Props) => {
  const [showChat, setShowChat] = createSignal(false);
  const [messages, setMessages] = createSignal([
    {
      sender: "bot",
      text: "Hello! 👋 Welcome to our store. How can we help you today?",
      time: "2:14 PM",
    },
  ]);
  const [messageInput, setMessageInput] = createSignal("");
  const [showTyping, setShowTyping] = createSignal(false);
  const [showProducts, setShowProducts] = createSignal(false);

  let chatMessagesRef: HTMLDivElement;

  function scrollToBottom() {
    chatMessagesRef.scrollTop = chatMessagesRef.scrollHeight;
  }

  function addMessage(sender: string, text: string) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [...prev, { sender, text, time }]);
    scrollToBottom();
  }

  function simulateTyping() {
    setShowTyping(true);
    scrollToBottom();
  }

  async function sendUserMessage() {
    const msg = messageInput().trim();
    if (!msg) return;
    addMessage("user", msg);
    setMessageInput("");
    simulateTyping();

    const lower = msg.toLowerCase();
    if (lower.includes("order") || lower.includes("status")) {
      const aiMsg = await genaiChatTools(context.token() || "", msg, "order");
      addMessage("bot", marked(aiMsg) as string);
      setShowTyping(false);
    } else if (lower.includes("return") || lower.includes("policy")) {
      addMessage(
        "bot",
        "We offer a 30-day return policy for most items. Items must be unused with tags attached. Would you like me to send you our full return policy?"
      );
      setShowTyping(false);
    } else if (lower.includes("product")) {
      const aiMsg = await genaiChatTools(context.token() || "", msg);
      addMessage("bot", marked(aiMsg) as string);
      setShowTyping(false);
    } else {
      const aiMsg = await genaiChatTools(context.token() || "", msg);
      addMessage("bot", marked(aiMsg) as string);
      setShowTyping(false);
      // setShowProducts(true);
    }
  }

  function handleSuggested(text: string) {
    setMessageInput(text);
    sendUserMessage();
  }

  onMount(() => {
    setTimeout(() => {
      if (!showChat()) {
        setShowChat(false);
        scrollToBottom();

        setTimeout(() => {
          simulateTyping();
          setTimeout(() => {
            addMessage(
              "bot",
              "We noticed you're browsing our new collection! Need any help finding something?"
            );
            setShowProducts(true);
          }, 1500);
        }, 2000);
      }
    }, 5000);
  });

  return (
    <>
      {/* Floating chat button */}
      <div class="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          onClick={() => setShowChat((prev) => !prev)}
          class="w-14 h-14 rounded-full bg-indigo-600 shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center text-white"
        >
          <i class="fas fa-comment-dots text-2xl"></i>
          {/* <span class="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping"></span> */}
        </button>
      </div>

      {/* Chat popup */}
      <Show when={showChat()}>
        <div class="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-t-xl rounded-bl-xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div class="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center">
                <i class="fas fa-headset"></i>
              </div>
              <div>
                <h3 class="font-semibold">Support Team</h3>
                <p class="text-xs opacity-80">Typically replies in 2 mins</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              class="w-6 h-6 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>

          {/* Chat messages */}
          <div
            class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50"
            ref={(el) => (chatMessagesRef = el)}
          >
            <For each={messages()}>
              {(msg) => (
                <div
                  class={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    class={`chat-message p-3 ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-l-xl rounded-tr-xl"
                        : "bg-indigo-100 text-gray-800 rounded-r-xl rounded-tl-xl"
                    }`}
                  >
                    <div innerHTML={msg.text}></div>
                    <span class="text-xs block mt-1">{msg.time}</span>
                  </div>
                </div>
              )}
            </For>

            {/* Typing indicator */}
            <Show when={showTyping()}>
              <div class="text-gray-500 text-xs">Bot is typing...</div>
            </Show>

            {/* Suggested queries */}
            <div class="flex flex-wrap gap-2 mt-2">
              <For
                each={["Order status", "Return policy", "Product questions"]}
              >
                {(query) => (
                  <button
                    onClick={() => handleSuggested(query)}
                    class="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition"
                  >
                    {query}
                  </button>
                )}
              </For>
            </div>

            {/* Product Quick View */}
            <Show when={showProducts()}>
              <div class="border-t border-gray-200 bg-white p-4 mt-3">
                <div class="flex space-x-3">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Product"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-sm">
                      Premium Wireless Headphones
                    </h4>
                    <p class="text-indigo-600 font-bold text-sm">$149.99</p>
                    <div class="flex mt-1">
                      <button class="bg-indigo-600 text-white text-xs px-2 py-1 rounded mr-2 hover:bg-indigo-700">
                        Add to Cart
                      </button>
                      <button class="bg-white text-indigo-600 border border-indigo-600 text-xs px-2 py-1 rounded hover:bg-indigo-50">
                        View Details
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProducts(false)}
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </Show>
          </div>

          {/* Input area */}
          <div class="p-3 bg-white border-t border-gray-200">
            <div class="flex items-center">
              <button class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mr-2">
                <i class="fas fa-paperclip text-gray-500"></i>
              </button>
              <button class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mr-2">
                <i class="fas fa-image text-gray-500"></i>
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={messageInput()}
                onInput={(e) => setMessageInput(e.currentTarget.value)}
                onKeyPress={(e) => e.key === "Enter" && sendUserMessage()}
              />
              <button
                onClick={sendUserMessage}
                class="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center ml-2"
              >
                <i class="fas fa-paper-plane text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};
