import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Header from "./Header";


function Bookclub() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const bookclubId = router.query.page;
    const [bookclub, setBookclub] = useState(null);
    const [follows, setFollows] = useState([]);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        if (!bookclubId) return;

        console.log('bookclubid', bookclubId);
        fetch(`http://localhost:3000/bookclubs/${bookclubId}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => {
                if (res.status == 403) return router.push('/');
                return res.json()
            })
            .then(data => {
                console.log('bk: ', data.bookclub);
                setBookclub(data.bookclub)
            });

        fetch(`http://localhost:3000/followers/bookclub/${bookclubId}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setFollows(data.followings)
                console.log('follow, ', data.followings);

            });
    }, [user, router]);

    return (
        <>
            <Header />
            <div>Page du club de lecture {bookclub?.name}</div>
        </>

    );
}

export default Bookclub;