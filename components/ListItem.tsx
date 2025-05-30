'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
    image: string;
    name: string;
    href: string;
}
const ListItem: React.FC<ListItemProps> = ({image, name, href}) => {
    const router = useRouter();

    const onClick = () => {
        //Add some authentication before pushhhhhh
        router.push(href);
    }
    return(
        <button onClick={onClick} className="relative flex items-center gap-x-4 group rounded-md overflow-hidden bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4">
            <div className="relative min-h-[64px] min-w-[64px]">
                <Image className="object-cover" fill src={image} alt="Image"/>
            </div>
            <p className="font-medium truncate py-5">{name}</p>
            <div className="transition absolute opacity-0 rounded-full flex items-center justify-center bg-green-500 p-3 drop-shadow-md right-3 group-hover:opacity-100 hover:scale-110">
                <FaPlay className="text-black"/>
            </div>
        </button>
    );
}
export default ListItem;