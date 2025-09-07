"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SignupData {
  date: string;
  total: number;
}

interface ChartBarInteractiveProps {
  data: SignupData[];
  title?: string;
  description?: string;
}

export function ChartBarInteractive({
  data,
  title = "Total Signups",
  description,
}: ChartBarInteractiveProps) {
  const totalSum = data.reduce((sum, entry) => sum + entry.total, 0);
  const defaultDescription = `Last 30 Days: ${totalSum}`;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description || defaultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px]"
          config={{
            date: { label: "Date" },
            total: { label: "Total" },
          }}
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
