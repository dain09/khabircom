import React from 'react';
import { Skeleton } from './Skeleton';

interface ResultCardSkeletonProps {
    count?: number;
}

export const ResultCardSkeleton: React.FC<ResultCardSkeletonProps> = ({ count = 1 }) => {
    return (
        <div className="mt-6 space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 bg-gray-50/80 dark:bg-dark-background/80">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
};
