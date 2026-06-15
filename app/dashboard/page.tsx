"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Dashboard.module.css";
import { useEffect, useState, useRef } from "react";
import { navItems } from "@/config/dashboardItems";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

        const sensorList: SensorReading[] = data.data;

        setLatest(sensorList[0]);
        setHistory(sensorList);

    } catch (err) {
        console.log("fetch error:", err);

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

    function getFreshnessScore(temp: number, humidity: number) {
        let score = 100;
        const idealTemp = 25;
        const idealHum = 50;

        score -= Math.abs(temp - idealTemp) * 2;
        score -= Math.abs(humidity - idealHum) * 1.2;

        if (score > 100) score = 100;
        if (score < 0) score = 0;

        return Math.round(score);
    }

    const chartData = [...history]
    .sort(
        (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
    )
    .map(item => {

        const temp = Number(item.aht21.temperature);
        const hum = Number(item.aht21.humidity);

        return {
            time: new Date(item.created_at).toLocaleTimeString(),
            temperature: temp,
            humidity: hum,
            score: getFreshnessScore(temp, hum)
        };
    });

    function getFreshness(temp: number, humidity: number) {
        if (
            temp >= 22 &&
            temp <= 28 &&
            humidity >= 40 &&
            humidity <= 60
        ) {
            return "Segar";
        }


        if (
            temp >= 20 &&
            temp <= 32 &&
            humidity >= 30 &&
            humidity <= 75
        ) {
            return "Kurang Segar";
        }


        return "Tidak Segar";
    }

    return (
        <div className={styles.container}>

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
                            <p className={styles.headerDevice}>
                                {latest.uuid} - AHT21
                            </p>
                        </div>

                        <div className={styles.currentCard}>

                            <div className={styles.card}>
                                <p className={styles.textCard}>Suhu</p>
                                <h2 className={styles.numberCard}>
                                    {latest.aht21.temperature}
                                </h2>
                                <p className={styles.miniText}>Celsius - °C</p>
                            </div>

                            <div className={styles.card}>
                                <p className={styles.textCard}>Kelembapan</p>
                                <h2 className={styles.numberCard}>
                                    {latest.aht21.humidity}
                                </h2>
                                <p className={styles.miniText}>Persen - %</p>
                            </div>

                            <div className={styles.card}>
                                <p className={styles.textCard}>Waktu</p>
                                <h2 className={styles.numberCard}>
                                    {new Date(latest.created_at).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false
                                    })}
                                </h2>
                                <p className={styles.miniText}>Waktu Langsung - live</p>
                            </div>
                            <div className={styles.card}>
                                <p className={styles.textCard}>Kondisi</p>
                                <h2 className={styles.numberCard}>
                                    {getFreshness(
                                        latest.aht21.temperature,
                                        latest.aht21.humidity
                                    )}
                                </h2>
                                <p className={styles.miniText}>
                                    Berdasarkan suhu & kelembapan
                                </p>
                            </div>
                        </div>

                        <div style={{ width: "100%", height: 400, marginTop: 48 }}>

                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#9f4f36"
                                        dot={true}
                                        animationDuration={300}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="#c3780f"
                                        dot={true}
                                        animationDuration={300}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#724a1d"
                                        dot={true}
                                        animationDuration={300}
                                    />

                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : (
                    <p>Add data by scanning with the sensor or adding it up manually.</p>
                )}

            </main>

        </div>
    );
}