"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface StatCardWithChartProps {
  title: string
  data: any[]
  type: "pie" | "bar"
  height?: number
}

export function StatCardWithChart({ title, data, type, height = 200 }: StatCardWithChartProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === "pie" ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Bar dataKey="calls" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
