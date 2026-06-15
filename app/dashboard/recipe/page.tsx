"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Resep.module.css";
import { navItems } from "@/config/dashboardItems";
import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (url: string) =>
    fetch(url).then(res => res.json());

type Resep = {
    id: number | string;
    uuid?: string;
    nama_resep?: string;
    author?: string;
    deskripsi?: string;
    thumbnail_url?: string | null;
    tags?: string[];
};

export default function Recipe() {

    const [search, setSearch] = useState("");

    function useDebounce(value: string, delay: number) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(handler);
        }, [value, delay]);

        return debouncedValue;
    }

const debouncedSearch = useDebounce(search, 500);
    const { data, error, isLoading } = useSWR(
        `/api/resep${debouncedSearch ? `?search=${debouncedSearch}` : ""}`,
        fetcher, { dedupingInterval: 60000 }
    );

    const resep: Resep[] = data?.data ?? [];

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
            
            <div className={styles.header}>
                <h1 className={styles.headerText}>
                    Temukan Resep
                </h1>

                <p className={styles.headerDesc}>
                    Bingung mau masak apa? temukan ide menu masakan hari ini di pantryku! Sahabat menu mu hari ini yang kreatif
                </p>

                <div className={styles.searchBar}>
                    <div className={styles.leftContainer}>
                        <button className={styles.filterButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 5h18v2H3zm2.5 6h13v2h-13zM8 17h8v2H8z"></path>
                            </svg>
                        </button>

                        <div className={styles.searchBars}>
                            <div className={styles.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8c1.85 0 3.54-.63 4.9-1.69l5.1 5.1L21.41 20l-5.1-5.1A8 8 0 0 0 18 10M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6"></path>
                                </svg>
                            </div>

                            <input
                                className={styles.inputBar}
                                type="text"
                                autoFocus
                                placeholder="Temukan Resep..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>


                <div className={styles.cardContainer}>

                    {isLoading && <p>Loading...</p>}
                    {error && <p>Failed to load</p>}

                    {resep.map((items) => (
                        <Link
                            href={`/recipe/${items.uuid}`}
                            key={items.id ?? items.uuid}
                        >
                            <div className={styles.card}>
                                <Image
                                    src={items.thumbnail_url ?? "/placeholder.jpeg"}
                                    alt={items.nama_resep ?? "recipe"}
                                    width={300}
                                    height={200}
                                    className={styles.cardImage}
                                />
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>
                                        {items.nama_resep}
                                    </h3>
                                    <p className={styles.cardDescription}>
                                        {items.deskripsi}
                                    </p>
                                    <div className={styles.tagContainer}>
                                        {items.tags?.map((tag, index) => (
                                            <div className={styles.tags} key={index}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}