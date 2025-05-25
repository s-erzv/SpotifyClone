import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
    return (
        <button className="transition rounded-full flex opacity-0 items-center bg-green-500 p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group group-hover:translate-y-0 hover:scale-110">
            <FaPlay className="text-black"/>
        </button>
    );
}

export default PlayButton;