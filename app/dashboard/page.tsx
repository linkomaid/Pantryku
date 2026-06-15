"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Dashboard.module.css";
import { useEffect } from "react";

export default function Dashboard() {

    useEffect(() => {
        const session = localStorage.getItem("session");

        if (!session) { window.location.href = "/signin" }
    }, [])

    return (
        <div  className={styles.container}>
            <div className={styles.sideBar}>
                <div className={styles.sideBar__header}>
                    <Image src="/favicon.png" width={44} height={44} priority alt="Logo"/>
                </div>
            </div>
        </div>
    )
}