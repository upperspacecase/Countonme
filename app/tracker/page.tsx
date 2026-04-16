import type { Metadata } from 'next';
import { Tracker } from '@/components/tracker/Tracker';

export const metadata: Metadata = {
  title: 'Tracker — Count on Me',
};

export default function TrackerPage() {
  return <Tracker />;
}
