"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RevenueProjections as RevenueProjectionsType } from "@/types"

type RevenueProjectionsProps = {
  projections: RevenueProjectionsType
}

export default function RevenueProjections({ projections }: RevenueProjectionsProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Expected Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{projections.expectedViews.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Projected Views</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monetization Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Potential Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projections.monetizationOptions.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>{option.type}</TableCell>
                  <TableCell className="text-right">${option.potential.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Cost</div>
                <div className="text-2xl font-bold">${projections.roi.cost.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Expected Revenue</div>
                <div className="text-2xl font-bold">${projections.roi.expectedRevenue.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Break-even Point</div>
              <div className="text-2xl font-bold">{projections.roi.breakEvenPoint.toLocaleString()} views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

