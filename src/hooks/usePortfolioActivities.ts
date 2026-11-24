import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mergeActivities, type ActivityRecord } from '../lib/portfolioActivities';

export function usePortfolioActivities() {
  const [activities, setActivities] = useState(() => mergeActivities([]));
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => onSnapshot(collection(db, 'activities'), snapshot => {
    const records: ActivityRecord[] = [];
    for (const item of snapshot.docs) {
      const data = item.data();
      if (data.deleted === true) records.push({ id: item.id, deleted: true });
      else if (typeof data.name === 'string') {
        records.push({
          ...data,
          id: item.id,
          name: data.name,
          description: typeof data.description === 'string' ? data.description : undefined,
        });
      }
    }
    setActivities(mergeActivities(records));
    setStatus('ready');
  }, error => {
    console.error('Could not load activities', error);
    setStatus('error');
  }), []);

  return { activities, status };
}
