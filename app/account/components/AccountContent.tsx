"use client";

import { useRouter } from "next/navigation";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { postData } from "@/libs/helpers";
import toast from "react-hot-toast";
import Button from "@/components/Button";

const AccountContent = () => {
    const router = useRouter();
    const subscribeModal = useSubscribeModal();
    const { isLoading, subscription, user } = useUser();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!isLoading && !user){
            router.replace('/');
        }
    }, [isLoading, user, router]);

    const redirectToCustomerPortal = async () => {
    setLoading(true);

    try {
        const { url } = await postData({
        url: '/api/create-portal-link',
        });

        if (!url) throw new Error("No URL returned");

        window.location.assign(url);
    } catch (error) {
        toast.error((error as Error).message);
    } finally {
        setLoading(false);
    }
    };


    return (
        <div className="mb-7 px-6">
            {!subscription && (
                <div className="felx flex-col gap-y-4">
                    <p className="mb-4">No active plan.</p>
                    <Button onClick={subscribeModal.onOpen} className="w-[300px]"> Subscribe</Button>
                </div>
            )}
            {subscription && (
                <div className="flex flex-col gap-y-4" disabled={isLoading || loading} onClick={redirectToCustomerPortal}>
                    <p className="mb-4">You are currenty=ly on the <b>{subscription?.prices?.products?.name}</b> plan.</p>
                    <Button className="w-[300px]" >
                        Open Customer Portal
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AccountContent;