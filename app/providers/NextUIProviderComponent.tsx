'use client';

import { NextUIProvider } from '@nextui-org/react';

export function NextUIProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
