import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingView = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );
};