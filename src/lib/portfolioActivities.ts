import { myActivities, type Activity } from '../data';

export type ManagedActivity = Activity & { id: string };
export type ActivityRecord = ManagedActivity | { id: string; deleted: true };

const legacyIds = new Set(myActivities.map(({ id }) => id));

export function isLegacyActivity(id: string) {
  return legacyIds.has(id);
}

export function mergeActivities(records: ActivityRecord[]): ManagedActivity[] {
  const activities = new Map(myActivities.map(activity => [activity.id, activity]));
  for (const record of records) {
    if ('deleted' in record) activities.delete(record.id);
    else activities.set(record.id, record);
  }
  return [...activities.values()];
}

export function getActivityText(activity: Activity) {
  const [title, ...rest] = activity.name.split('|');
  return {
    title: activity.description === undefined ? title.trim() : activity.name,
    description: activity.description ?? rest.join(' ').trim(),
  };
}
