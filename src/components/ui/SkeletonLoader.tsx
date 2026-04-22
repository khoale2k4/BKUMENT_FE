"use client";

import React from "react";
import { Skeleton } from "@mantine/core";

interface SkeletonLoaderProps {
  variant: "notification" | "card" | "profile" | "text";
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant, count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === "notification") {
    return (
      <div className="flex flex-col gap-4">
        {items.map((_, i) => (
          <div key={i} className="flex gap-4 p-5 border-b border-slate-100 bg-white">
            <Skeleton height={40} circle />
            <div className="flex-1 space-y-2">
              <Skeleton height={15} width="40%" radius="xl" />
              <Skeleton height={12} width="90%" radius="xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton height={36} circle />
              <div className="space-y-1">
                <Skeleton height={12} width={100} radius="xl" />
                <Skeleton height={10} width={60} radius="xl" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton height={20} width="70%" radius="xl" />
                <Skeleton height={15} width="90%" radius="xl" />
                <Skeleton height={15} width="80%" radius="xl" />
              </div>
              <Skeleton height={80} width={120} radius="md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton height={120} circle />
          <Skeleton height={24} width={200} radius="xl" />
          <Skeleton height={16} width={300} radius="xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <Skeleton key={i} height={12} radius="xl" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
