"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import { navItems } from "@/config/dashboardItems";
import { useRef } from "react";

type SensorReading = {
    uuid: string;
    aht21: {
        temperature: number;
        humidity: number;
    };
    created_at: string;
};

export default function Dashboard() {

    const [latest, setLatest] = useState<SensorReading | null>(null);
    const [history, setHistory] = useState<SensorReading[]>([]);

    const running = useRef(false);

    async function fetchData() {

        if (running.current) return;

        running.current = true;

        try {
            const res = await fetch("/api/sensor");
            const data = await res.json();

            if (!data.connected || !data.data) return;

            const sensor = data.data;

            setLatest(sensor);

            setHistory(prev => {
                const exists = prev.some(
                    item => item.created_at === sensor.created_at
                );

                if (exists) return prev;

                return [sensor, ...prev].slice(0, 20);

            });

        } finally {
            running.current = false;
        }
    }

    useEffect(() => {

        const session = localStorage.getItem("session");

        if (!session) {
            window.location.href = "/signin";
            return;
        }

        fetchData();

        const interval = setInterval(fetchData, 3000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className={styles.container}>

            {/* SIDEBAR */}
            <div className={styles.sideBar}>

                <div className={styles.sideBar__header}>
                    <Image
                        src="/favicon.png"
                        width={44}
                        height={44}
                        priority
                        alt="Logo"
                    />
                </div>

                <div className={styles.sideBar__navigation}>
                    {navItems.map((items, index) => (
                        <Link href={items.href} key={index}>
                            <div className={styles.sideBar__navigationItems}>
                                <div className={styles.sidebar__navIcon}>
                                    {items.icon}
                                </div>
                                <div className={styles.popOver}>
                                    {items.label}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.bottomBar}>
                    <button className={styles.logOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 13h7v-2H9V7l-6 5 6 5z"></path>
                            <path d="M19 3h-7v2h7v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"></path>
                        </svg>
                    </button>
                </div>

            </div>

            <main className={styles.mainBody}>
                {latest ? (
                    <>
                        <div className={styles.headers}>
                            <h1 className={styles.headerText}>Dashboard</h1>
                            <p className={styles.headerDevice}>{latest.uuid} - AHT21</p>
                        </div>

                        <div className={styles.currentCard}>
                            <div className={styles.card}>
                                <p className={styles.textCard}>Suhu</p>
                                <h2 className={styles.numberCard}>{latest?.aht21.temperature}</h2>
                                <p className={styles.miniText}>
                                    Celsius - °C
                                </p>
                            </div>
                            <div className={styles.card}>
                                <p className={styles.textCard}>Kelembapan</p>
                                <h2 className={styles.numberCard}>{latest?.aht21.humidity}</h2>
                                <p className={styles.miniText}>
                                    Persen - %
                                </p>
                            </div>
                            <div className={styles.card}>
                                <p className={styles.textCard}>Waktu</p>
                                <h2 className={styles.numberCard}>{new Date(latest.created_at).toLocaleString()}</h2>
                                <p className={styles.miniText}>
                                    D/M/Y, H:M:S
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}

            </main>

        </div>
    );
}