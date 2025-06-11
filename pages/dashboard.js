import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from '../styles/Dashboard.module.css'
import Header from "../components/Header";
import DashboardBookclubs from "../components/DashboardBookclubs";
import DashboardEvents from "../components/DashboardEvents";

function DashboardPage() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
    }, [user, router]);

    const content = () => {
        switch (activeTab) {
            case 0:
                return <DashboardBookclubs />;
            case 1:
                return <DashboardEvents />;
            default:
                return null;
        }
    };

    const tabs = ['Clubs de lecture', 'Evènements'];
    const styleTabs = tabs.map((_, idx) => {
        if (idx === activeTab) return {fontWeight: 'bold', color: 'var(--text-light)', backgroundColor: 'var(--button-hover)'};
        else return {};
    })

    return (
        <div>
            <Header />
            <div className={styles.container}>
                Bienvenue {user.pseudo} !
                <div className={styles.content}>
                    <div className={styles.tabs}>
                        <button onClick={() => setActiveTab(0)} style={styleTabs[0]}>Clubs de lecture</button>
                        <button onClick={() => setActiveTab(1)} style={styleTabs[1]}>Evènements</button>
                    </div>
                    <div className={styles.tabContent}>{content()}</div>
                </div>
            </div>
        </div >
    );
}

export default DashboardPage;