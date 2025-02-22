import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, DollarSign } from "lucide-react"

export default function QuickStats() {
  const stats = [
    { title: "Videos", value: "124", icon: Video },
    { title: "Views", value: "1.2M", icon: Eye },
    { title: "Revenue", value: "$15,230", icon: DollarSign },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

