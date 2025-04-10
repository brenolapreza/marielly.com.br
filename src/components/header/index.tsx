import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full h-20  bg-primary-200">
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
        <ul className="flex gap-8">
          <li>
            <Link href="/">HOME</Link>
          </li>
          <li>
            <Link href="/">HOME</Link>
          </li>
          <li>
            <Link href="/">HOME</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
