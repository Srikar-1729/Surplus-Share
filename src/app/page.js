// import RootLayout from "./layout"
import Image from "next/image";
import Navbar from "./custom_components/Navbar";
import { Merriweather,Montserrat } from "next/font/google";

const merriweather = Merriweather({
    weight: ['900'],
    variable: '--font-merriweather',
  });

  const montserrat = Montserrat({
    weight: ['400'],
    variable: '--font-montserrat',
  });

export default function Home() {
  return (
    <div>
        <Navbar ></Navbar>
                <div className="flex justify-between items-center pt-14">
          <div className="px-20 flex-col gap-20">
            <h1 className={` ${merriweather.className} font-bold text-green-700 text-7xl py-5`}>Donate Your Leftover Food to Those in Need</h1>
            <p className="text-3xl text-green-800">Share surplus food to local charities and help fight hunger in your community.</p>
          </div>
          <Image src="/child.jpg" width="880" height="700" alt="Picture of a child eating." className=""></Image>
        </div>
        <p className={`${montserrat.className} text-3xl m-10 text-center text-amber-900` }>"If you can't feed a hundred people, then feed just one" - <span className="italic ">Mother Teresa</span></p>

        
    </div>
  );
}
