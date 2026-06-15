export async function getResep() {
    const res = await fetch("api/resep");

    if ( !res.ok ) { throw new Error("Failed to fetch recipe"); }
    return res.json();
}