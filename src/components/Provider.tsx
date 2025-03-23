import { ReactNode } from 'react';

export default function Provider({ children }: { children: ReactNode }) {
  return <div className="antialiased">{children}</div>;
}
