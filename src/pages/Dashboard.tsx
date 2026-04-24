const Dashboard = () => {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col justify-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">VitaCare</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Dashboard</h1>
      </div>
    </main>
  );
};

export default Dashboard;