"use client";

import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/config/dashboardItems";
import styles from "./Ingredient.module.css";

export default function Ingredient() {
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
        </div>
    )
}