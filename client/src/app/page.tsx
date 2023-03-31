import Link from 'next/link';

export default function Home() {
    return (
        <main className="bg-black text-white">
            <h1>Home Page</h1>
            <Link href="/login">Login</Link>
            <Link href="/todo">Todo</Link>
        </main>
    );
}
