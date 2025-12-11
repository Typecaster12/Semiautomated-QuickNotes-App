import { Navbar } from "../components/Navbar";
import { DashboardHero } from "../components/DashboardHero";

export const Dashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <DashboardHero />
        </div>
    );
};
