'use client';

import { Skeleton } from '@nextui-org/react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-[#183D3D]">
      <div className="h-screen p-10 max-w-[500px] mx-auto flex flex-col justify-center gap-10">
        <div>
          <Skeleton className="flex w-full h-10 rounded-lg bg-sky-500" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-lg bg-sky-500" />
          <Skeleton className="h-10 w-full rounded-lg bg-sky-500" />
          <Skeleton className="h-10 w-full rounded-lg bg-sky-500" />
          <Skeleton className="h-10 w-full rounded-lg bg-sky-500" />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full bg-sky-500" />
          <Skeleton className="h-10 w-32 rounded-lg bg-sky-500" />
          <Skeleton className="h-16 w-16 rounded-full bg-sky-500" />
        </div>
      </div>
    </div>
  );
};
export default LoadingSkeleton;
