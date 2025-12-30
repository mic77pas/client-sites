import Image from "next/image";
import { IoCameraOutline, IoVideocamOutline, IoLaptopOutline, IoPeople } from "react-icons/io5";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-white bg-black/40 rounded-xl">
      <div
        className="
        w-full
        h-40
        bg-[url('/toronto.jpg')]
        bg-cover
        bg-[position:50%_60%]
        flex
        flex-col
        items-center
        text-white mb-4 rounded-xl py-6 px-4 shadow-lg shadow-black/40"
      >
        <h2 className="font-montserrat text-4xl font-semibold mb-6 tshadow-lg">
          Who am I?
        </h2>
        <nav className="w-full h-full flex flex-row gap-4 text-md">
          <div className="card bg-black/80">
            <div className="flex flex-row justify-center items-center font-semibold gap-2 tshadow-sm">
              <IoCameraOutline size={20}/>
              Photography
            </div>
          </div>
          <div className="card bg-black/80">
            <div className="flex flex-row justify-center items-center font-semibold gap-2 tshadow-sm">
              <IoVideocamOutline size={22}/>
              Videography
            </div>
          </div>
          <div className="card bg-black/80">
            <div className="flex flex-row justify-center items-center font-semibold gap-2 tshadow-sm">
              <IoLaptopOutline size={20}/>
              Media Editing
            </div>
          </div>
          <div className="card bg-black/80">
            <div className="flex flex-row justify-center items-center font-semibold gap-2 tshadow-sm">
              <IoPeople size={20}/>
              Social Media
            </div>
          </div>
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-4 mb-4">
        <p className="font-montserrat text-lg text-start">
          I’m <span className="font-bold">Nik Karpov</span>, a multidisciplinary
          visual creator working across
          <span className="font-bold">
            {" "}
            photography, videography, and editing
          </span>
          . My work is rooted in storytelling, capturing moments, movement, and
          emotion through intentional visuals.
        </p>
        <p className="font-montserrat text-lg text-start">
          Alongside production, I bring experience in{" "}
          <span className="font-bold">social media management</span>, allowing
          me to create content with both creativity and strategy in mind. From
          shooting to editing to platform-ready delivery, I focus on visuals
          that connect.
        </p>
        <p className="font-montserrat text-lg text-start">
          <span className="font-bold">
            Based in Aurora and available across Toronto, Newmarket, and the
            greater GTA
          </span>
          , I’m always open to new projects, collaborations, and creative
          challenges.
        </p>
        {/* <button className="btn mt-4 h-10"></button> */}
      </div>
    </div>
  );
}
