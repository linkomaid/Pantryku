"use client";

import styles from "./Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { navItems, howItWorksItems, chipItems } from "@/config/config";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

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

                const isActive = pathname === item.href;

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

      <main className={styles.mainContent}>
        <div className={styles.leftContainer}>
          <h1 className={styles.title}>
            Hai, lagi pengen masak apa hari ini?
          </h1>
          <div className={styles.description}>
            Kenalan sama Pantryku, platform pintar yang jagain dapurmu tetap segar. Terintegrasi langsung dengan sensor deteksi otomatis, kami bantu kamu rekam histori kesegaran makanan, kelola daftar belanjaan tanpa ribet, dan temukan resep masakan seru setiap hari. No more food wasted, just good food daily!
          </div>
          <Link href="/signin" className={styles.cta}>
            Coba Sekarang!
            <svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"2 2 20 20"}><path d="m9.71 17.71 5.7-5.71-5.7-5.71-1.42 1.42 4.3 4.29-4.3 4.29z" aria-hidden="true"></path></svg>
          </Link>
        </div>
      </main>
      
      <section className={styles.howItWorks}>
        <div className={styles.cardsContainer}>
          {howItWorksItems.map((items, index) => (
              <div key={index} className={`${styles.card} ${
                  index === 0 ? styles.firstCard : ""
                } ${
                  index === howItWorksItems.length - 1 ? styles.lastCard : ""
                }`}>

              <div className={styles.icon}>
                {items.icon}
              </div>
              
              <div className={styles.header}>
                <h2 className={styles.headerText}>
                  {items.label}
                </h2>

                <p className={styles.headerDesc}>
                  {items.description}
                </p>
              </div>
              
              </div>
          ))}
        </div>
      </section>

      <section className={styles.aboutPantry}>
        <div className={styles.pantryContainer}>
          <div className={styles.left}>
            <h3 className={styles.headerText}>Tentang Pantryku</h3>
            <div className={styles.description}>
              Pantryku adalah platform manajemen pantry pintar inovatif yang mengintegrasikan teknologi IoT (Internet of Things) untuk menjaga kesegaran bahan makanan Anda secara real-time. Berawal dari keresahan akan tingginya angka buangan makanan (food waste) di rumah tangga, Pantryku hadir sebagai asisten dapur digital yang memastikan tidak ada lagi bahan makanan yang terbuang sia-sia di kulkas atau lemari penyimpanan Anda. Pantryku juga dilengkapi dengan fitur memory page, smart shopping list, dan rekomendasi resep masakan guna mewujudkan Smart Pantry, Zero Waste!
            </div>
            <div className={styles.chipsContainer}>
              {chipItems.map((items, index) => (
                <div key={index} className={styles.chip}>
                  <div className={styles.label}>
                    {items}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            <Image
              src="/background.jpeg" 
              alt="Logo" 
              width={600} 
              height={400}
              className={styles.images}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
