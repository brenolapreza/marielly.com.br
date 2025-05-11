import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full h-20 sticky top-0 bg-primary-200">
      <div className="container flex items-center justify-between h-full">
        <div className="">
          <Image
            src="/logo.svg"
            alt="Next.js logo"
            width={60}
            height={62}
            priority
          />
        </div>
        <ul className="flex md:gap-8 gap-3 md:text-[16px] text-[14px]">
          <li>
            <Link href="#home">Home</Link>
          </li>
          <li>
            <Link href="#terapia">Terapia online</Link>
          </li>
          <li>
            <Link href="#contato">Contato</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
