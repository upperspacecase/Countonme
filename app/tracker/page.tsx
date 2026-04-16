import type { Metadata } from 'next';
import { Tracker } from '@/components/tracker/Tracker';

export const metadata: Metadata = {
  title: 'My Tracker — Simply Accountable',
};

export default function TrackerPage() {
  return <Tracker />;
}
