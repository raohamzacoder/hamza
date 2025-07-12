'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/Toasts/toast';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Toaster() {
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // ✅ Ensure searchParams is not null before using
    if (!searchParams) return;

    const status = searchParams.get('status') ?? '';
    const status_description = searchParams.get('status_description') ?? '';
    const error = searchParams.get('error') ?? '';
    const error_description = searchParams.get('error_description') ?? '';

    if (error || status) {
      toast({
        title: error
          ? error || 'Hmm... Something went wrong.'
          : status || 'Alright!',
        description: error ? error_description : status_description,
        variant: error ? 'destructive' : undefined
      });

      // ✅ Safely clear toast-related query params
      const newSearchParams = new URLSearchParams(searchParams.toString());
      ['error', 'status', 'status_description', 'error_description'].forEach((param) =>
        newSearchParams.delete(param)
      );

      const newPath = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newPath, { scroll: false });
    }
  }, [searchParams, pathname, router, toast]);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
