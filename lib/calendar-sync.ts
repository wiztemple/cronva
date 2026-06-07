/** Detail page URL for picking events before syncing to a calendar app */
export function calendarSyncHref(slug: string): string {
  return `/cal/${slug}?sync=1`
}
