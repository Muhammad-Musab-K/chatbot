"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import axios from 'axios';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { SendIcon, Triangle } from '@/components/icon/SendIcon';
import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'

function chatbot() {
  const [messages, setMessages] = useState<{ sender: string; message: string; error?: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const chatApi = async (message: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`https://chatbot.thecodingbuzz.com/`, {
        message
      });

      const { success, data } = response?.data;
      if (success) {
        const botResponse = data?.response?.result;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: botResponse },
        ]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: 'There is something wrong. Try later', error: true },
      ]);
      toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "customer", message: inputMessage },
    ]);
    chatApi(inputMessage);
    setInputMessage("");
  };

  return (
    <div className=" w-[320px] m-auto shadow-lg rounded-lg border">
      <div className="flex items-center p-4 gap-2 border-b">
        <Avatar>
          <AvatarImage src="https://static.vecteezy.com/system/resources/previews/010/054/157/original/chat-bot-robot-avatar-in-circle-round-shape-isolated-on-white-background-stock-illustration-ai-technology-futuristic-helper-communication-conversation-concept-in-flat-style-vector.jpg" alt="Support Bot" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-lg">Support Bot</p>
          <p className="text-xs text-slate-500">Online</p>
        </div>
      </div>

      <ScrollArea className="h-80 bg-slate-100 px-2 pb-1 ">
        <div className="flex flex-col gap-3 ">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-2 ${msg.sender === 'bot' ? '' : 'justify-end'}`}>
              {msg.sender === 'bot' && (
                <Avatar>
                  <AvatarImage src="https://static.vecteezy.com/system/resources/previews/010/054/157/original/chat-bot-robot-avatar-in-circle-round-shape-isolated-on-white-background-stock-illustration-ai-technology-futuristic-helper-communication-conversation-concept-in-flat-style-vector.jpg" alt="Support Bot" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className={`${msg.sender === 'bot' ? 'mt-6' : ''}`}>
                <p className={`text-xs text-slate-500 ${msg.sender === 'bot' ? '' : 'text-right'}`}>{msg.sender === 'bot' ? 'Support Bot' : 'Customer'}</p>
                <div className='flex gap-1 items-center'>
                  <div className={`p-2 lg:p-3 rounded-3xl ${msg.sender === 'bot' ? 'bg-white rounded-tl-none' : 'bg-blue-500 text-white rounded-tr-none'} shadow-sm`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {msg.error && <p>{Triangle}</p>}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src="https://static.vecteezy.com/system/resources/previews/010/054/157/original/chat-bot-robot-avatar-in-circle-round-shape-isolated-on-white-background-stock-illustration-ai-technology-futuristic-helper-communication-conversation-concept-in-flat-style-vector.jpg" alt="Support Bot" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='mt-6'>
                <p className='text-xs text-slate-500'>Support Bot</p>
                <div className="p-3 bg-white rounded-3xl rounded-tl-none shadow-sm">
                  <ThreeDots
                    visible={true}
                    height="15"
                    width="30"
                    color="gray"
                    radius="9"
                    ariaLabel="three-dots-loading"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-3 bg-gray-50">
        <form onSubmit={handleSend}>
          <div className="flex items-center gap-2">
            <Input
              className="p-2"
              placeholder="Reply...."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button
              disabled={loading}
              variant="ghost"
              type="submit"
              size="sm"
            >
              {SendIcon}
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default chatbot;