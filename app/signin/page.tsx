"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Signin.module.css";
import { useState  } from "react";

export default function Login () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin () {
        const res = await fetch('/api/auth/login', { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json();

        if ( !data.success ) {
            alert(data.message);
            return;
        }

        localStorage.setItem("session", JSON.stringify(data.session));

        alert("Login Success");
        window.location.href = "/dashboard"

    }


    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.logo}>
                        <Image
                            src="/favicon.png" 
                            alt="Logo" 
                            width={56} 
                            height={56}
                            priority
                        />
                    </div>
                    <div className={styles.cardTextHeader}>
                        Masuk
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        autoFocus
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>
                        Masuk
                    </button>
                </div>
                <Link href="/" className={styles.backButton}>
                    <svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="m6 12 6 5v-4h6v-2h-6V7z"></path></svg>
                    Kembali
                </Link>
            </div>
            
        </div>
    )
}