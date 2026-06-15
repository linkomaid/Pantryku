"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/recipe/Resep.module.css";
import { navItems } from "@/config/config";
import { usePathname, useParams } from "next/navigation";

type Resep = {
    id: number | string;
    uuid?: string;
    nama_resep?: string;
    author?: string;
    deskripsi?: string;
    thumbnail_url?: string | null;
    tags?: string[];
    bahan?: string[];
    steps?: string[];
};

export default function RecipeDetail() {

    const pathname = usePathname();
    const { uuid } = useParams();

    const [resep, setResep] = useState<Resep | null>(null);


    useEffect(() => {

        async function loadResep() {

            const res = await fetch(`/api/resep?uuid=${uuid}`);
            const result = await res.json();

            setResep(result.data);

        }

        if (uuid) {
            loadResep();
        }

    }, [uuid]);


    return (
        <div className={styles.container}>

            <header className={styles.headerMain}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Image
                            src="/favicon.png"
                            alt="Logo"
                            width={44}
                            height={44}
                            priority
                        />
                    </Link>

                    <nav className={styles.navigationBar}>
                        {navItems.map((item) => {

                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navLink} ${
                                        isActive ? styles.active : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
r
                <nav className={styles.navigationBar}>
                    <Link
                        href="/signin"
                        className={`
                        ${styles.secondary}
                        ${styles.buttonLink}
                        `}
                    >
                        Masuk
                    </Link>

                    <Link
                        href="/"
                        className={`
                        ${styles.primary}
                        ${styles.buttonLink}
                        `}
                    >
                        Daftar
                    </Link>
                </nav>
            </header>

            <div className={styles.header}>

                {!resep ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Image
                            src={resep.thumbnail_url ?? "/placeholder.jpeg"}
                            alt={resep.nama_resep ?? "recipe"}
                            width={600}
                            height={400}
                            className={styles.cardImage}
                        />

                        <h1 className={styles.cardTitle}>
                            {resep.nama_resep}
                        </h1>

                        <p className={styles.cardDescription}>
                            {resep.deskripsi}
                        </p>

                        <p>
                            {resep.author}
                        </p>

                        <div className={styles.tagContainer}>
                            {resep.tags?.map((tag, index) => (
                                <div className={styles.tags} key={index}>
                                    {tag}
                                </div>
                            ))}
                        </div>

                    </>
                )}

            </div>

        </div>
    );
}