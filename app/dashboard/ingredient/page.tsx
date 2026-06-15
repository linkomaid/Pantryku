"use client";

import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/config/dashboardItems";
import styles from "./Ingredient.module.css";
import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Item = {
    id: number;
    genid: string;
    nama_bahan: string;
    kuantitas: number;
    habis: boolean;
    timestamp: string | null;
    created_at: string;
};

export default function Ingredient() {

    const [items, setItems] = useState<Item[]>([]);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        nama_bahan: "",
        kuantitas: 1
    });

    const [generating, setGenerating] = useState(false);

    const genid = "user-123";

    async function fetchItems() {
        const res = await fetch(`/api/shop?genid=${genid}`);
        const data = await res.json();
        setItems(data.data || []);
    }

    useEffect(() => {
        fetchItems();
    }, []);

    async function addItem() {
        await fetch("/api/shop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                genid,
                ...form
            })
        });

        setForm({ nama_bahan: "", kuantitas: 1 });
        setOpen(false);
        fetchItems();
    }

    async function consume(id: number) {
        await fetch("/api/shop", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        fetchItems();
    }

    function getStockStatus(qty: number) {
        if (qty === 0) return { text: "Habis", color: "red" };
        if (qty <= 2) return { text: "Low Stock", color: "orange" };
        return { text: "Aman", color: "green" };
    }

    const chartData = items.map(i => ({
        name: i.nama_bahan,
        qty: i.kuantitas
    }));

    async function generatePDF() {
        setGenerating(true);

        const pdf = new jsPDF("p", "mm", "a4");

        pdf.text("Monthly Inventory Report", 10, 10);

        pdf.text(`Total items: ${items.length}`, 10, 20);

        pdf.text(
            `Low stock: ${items.filter(i => i.kuantitas <= 2 && i.kuantitas > 0).length}`,
            10,
            30
        );

        pdf.text(
            `Out of stock: ${items.filter(i => i.kuantitas === 0).length}`,
            10,
            40
        );

        const chartEl = document.getElementById("inventory-chart");

        if (chartEl) {
            const canvas = await html2canvas(chartEl);
            const img = canvas.toDataURL("image/png");

            pdf.addImage(img, "PNG", 10, 50, 180, 80);
        }

        let y = 140;
        pdf.text("Run-out Items:", 10, y);

        items
            .filter(i => i.kuantitas === 0)
            .forEach(i => {
                y += 8;
                pdf.text(`- ${i.nama_bahan}`, 10, y);
            });

        setTimeout(() => {
            pdf.save("inventory-report.pdf");
            setGenerating(false);
        }, 1200);
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


            <div className={styles.mainBody}>

                <div className={styles.containerBody}>
                    <div className={styles.header}>
                        <div className={styles.leftHeader}>
                            Bahan-bahan (Inventory)
                        </div>

                        <div className={styles.rightHeader}>

                            <button
                                onClick={() => setOpen(true)}
                                className={styles.primary}
                            >
                                <svg  xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="M3 13h8v8h2v-8h8v-2h-8V3h-2v8H3z"></path></svg>
                                Tambah
                            </button>

                            <button
                                onClick={generatePDF}
                                className={styles.secondary}
                            >
                                {generating ? "Generating..." : "Generate Report"}
                            </button>

                        </div>
                    </div>
                    {open && (
                        <div className={styles.modal_ak}>
                            <div className={styles.modal}>
                                <input
                                    placeholder="Nama bahan"
                                    value={form.nama_bahan}
                                    onChange={(e) =>
                                        setForm({ ...form, nama_bahan: e.target.value })
                                    }
                                />

                                <input
                                    type="number"
                                    value={form.kuantitas}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            kuantitas: Number(e.target.value)
                                        })
                                    }
                                />

                                <button onClick={addItem} className={styles.primary}>
                                    Save
                                </button>

                                <button
                                    onClick={() => setOpen(false)}
                                    className={styles.secondary}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        id="inventory-chart"
                        style={{ width: "100%", height: 250 }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="qty"
                                    stroke="#311f09"
                                    dot={true}
                                    animationDuration={300}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.itemList}>
                        {items.map((item) => {
                            const status = getStockStatus(item.kuantitas);

                            return (
                                <div key={item.id} className={styles.itemCard} onClick={() => { if (item.kuantitas > 0) consume(item.id); }}
                                    style={{
                                        opacity: item.kuantitas === 0 ? 0.5 : 1,
                                        cursor: item.kuantitas === 0 ? "not-allowed" : "pointer",
                                        pointerEvents: item.kuantitas === 0 ? "none" : "auto"
                                    }}>
                                    <h3>{item.nama_bahan}</h3>
                                    <p className={styles.qty}>{item.kuantitas}</p>
                                    <p className={styles.status} style={{ color: status.color }}>
                                        {status.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}