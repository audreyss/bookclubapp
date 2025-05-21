import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function DashboardEvents() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
    }, [user, router]);

    return (
        <div>
            Lectures
            Votes
        </div >
    );
}

export default DashboardEvents;