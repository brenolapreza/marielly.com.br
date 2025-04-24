import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export const Whatsapp = () => {
  return (
    <div className="cursor-pointer fixed bottom-4 right-4 bg-green-1 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <WhatsappLogo color="#f2f2f2" size={28} />
    </div>
  );
};
