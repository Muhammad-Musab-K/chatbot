import dynamic from 'next/dynamic';

const ChatbotClient = dynamic(() => import('@/app/chatbot/page'), { ssr: false });


function page() {
  return (
    <div>
      <ChatbotClient />
    </div>
  )
}

export default page
