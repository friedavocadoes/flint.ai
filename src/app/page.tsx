import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* <p>hello world</p> */}
      <Image src="/ww.jpg" width={500} height={500} alt="hello" />
    </>
  );
}
