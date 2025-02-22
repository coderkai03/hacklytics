import QuickStats from "./QuickStats"
import PerformanceGraph from "./PerformanceGraph"
import VideoList from "./VideoList"

export default function Dashboard() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-8">
        <QuickStats />
        <PerformanceGraph />
        <VideoList />
      </div>
    </main>
  )
}

