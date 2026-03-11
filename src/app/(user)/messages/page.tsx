import MessagesPage from "@/screens/messages/page";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Message | VBook",
  description: "Social media for education",
};

export default function MessagesApp() {
  return (
    <MessagesPage/>
  );
}