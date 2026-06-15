export const navItems = [
    { label: "Rumah", href: "/" },
    { label: "Resep", href: "/recipe" },
];

export const howItWorksItems = [
    { 
        label: "Taruh Makanan", 
        description: "​Taruh bahan makanan (seperti daging, sayur, atau buah) ke area sensor detektor Pantryku.",
        icon: (
            <svg  xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="M19 6.84V3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v3.84l-1.95 5.85c-.03.1-.05.21-.05.28v8c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-8c0-.11-.02-.21-.05-.28zM6.72 8h9.89l-1.33 4H5.39zM7 4h10v2H7zM5 14h10v6H5zm14 6h-2v-6.84l1-3 1 3z" aria-hidden="true"></path></svg>
        ),
    },
    { 
        label: "Deteksi Sensor", 
        description: "​Sensor VOC (Volatile Organic Compounds) yang tertanam pada alat akan mulai bekerja. Saat makanan mulai mengalami penurunan kualitas, sensor pintar ini mendeteksi perubahan tersebut secara real-time.", 
        icon: (
            <svg  xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="M9 5V3H3v6h2V5zm12 4V3h-6v2h4v4zm-2 10h-4v2h6v-6h-2zM5 15H3v6h6v-2H5zm-3-4h20v2H2z" aria-hidden="true"></path></svg>
        ),
    },
    { 
        label: "Notifikasi", 
        description: "Dapatkan notifikasi tentang informasi kesegaran bahan pangan. Segar/Kurang Segar/Tidak Segar", 
        icon: (
            <svg  xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="M19 12.59V10c0-3.22-2.18-5.93-5.14-6.74C13.57 2.52 12.85 2 12 2s-1.56.52-1.86 1.26C7.18 4.08 5 6.79 5 10v2.59L3.29 14.3a1 1 0 0 0-.29.71v2c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-2c0-.27-.11-.52-.29-.71zM19 16H5v-.59l1.71-1.71a1 1 0 0 0 .29-.71v-3c0-2.76 2.24-5 5-5s5 2.24 5 5v3c0 .27.11.52.29.71L19 15.41zM5.64 3.3 4.23 1.89A10.9 10.9 0 0 0 1 9.67h2c0-2.4.94-4.66 2.64-6.36Zm12.72 0C20.06 5 21 7.26 21 9.66h2c0-2.94-1.14-5.7-3.22-7.78l-1.41 1.41ZM12 22c1.31 0 2.41-.83 2.82-2H9.18c.41 1.17 1.51 2 2.82 2" aria-hidden="true"></path></svg>
        ),
    },
    { 
        label: "Pantau", 
        description: "​Hasil deteksi otomatis dikirim dan tercatat di memory page platform Pantryku. Sistem akan merekomendasikan resep masakan yang tepat sesuai dengan bahan yang harus segera dihabiskan.", 
        icon: (
            <svg  xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill={"currentColor"} viewBox={"0 0 24 24"}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h3v-2H4V6h16v12h-3v2h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2"></path><path d="M7 22h10l-5-6z" aria-hidden="true"></path></svg>
        ),
    },
]

export const chipItems = [
    "Gratis",
    "Andal",
    "Pintar",
    "Mudah"
]