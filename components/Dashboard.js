import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function Dashboard() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    console.log(user);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
    }, [user, router]);
    
    return (
        <div>
            Bienvenue {user.pseudo} !
        </div>
    );
}

export default Dashboard;