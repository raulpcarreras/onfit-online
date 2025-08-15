export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center bg-neutral-950 text-white">
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">ONFIT ONLINE (Web)</h1>
        <p className="text-neutral-400 mt-2">
          Ir a{" "}
          <a href="/(auth)/login" className="underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
