import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

// Re-export navigation hooks from Next.js for dynamic routes
export { useParams, useSearchParams } from 'next/navigation';
