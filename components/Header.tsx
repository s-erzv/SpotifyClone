'use client';
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

import  Button  from "./Button"
import usePlayer from "@/hooks/usePlayer";

interface HeaderProps {
    children: React.ReactNode
    className?: string
}

const Header: React.FC<HeaderProps> = ({children, className}) => {
    const authModal = useAuthModal();
    const router = useRouter();
    const player = usePlayer();

    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();

        player.reset();
        router.refresh();

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Logged out');
        }
    }
    return (
        <div className={twMerge('h-fit bg-gradient-to-b from-emerald-800 p-6', className)}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretLeft className="text-white" size={35}/>
                    </button>
                    <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretRight onClick={() => router.forward()} className="text-white" size={35}/>
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition">
                        <HiHome className="text-black " size={20}/>
                    </button>
                    <button className="rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition">
                        <BiSearch className="text-black " size={20}/>
                    </button>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                    {user? (
                        <div className="flex gap-x-4 items-center">
                            <button onClick={handleLogout} className="bg-white px-6 py-2 text-black font-bold rounded-full hover:opacity-75 transition">
                                Logout
                            </button>
                            <button
                                onClick={() => router.push('./account')}
                                className="bg-white p-2 rounded-full hover:opacity-75 transition"
                                >
                                <FaUserAlt className="text-black w-5 h-5" />
                            </button>

                        </div>
                    ) : (
                        <>
                        <div>
                            <Button onClick={authModal.onOpen} className="bg-transparent text-neutral-300 font-medium">
                                Sign Up
                            </Button>
                        </div>
                        <div>
                            <Button onClick={authModal.onOpen} className="bg-white px-6 py-2">
                                Log in
                            </Button>
                        </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

export default Header;