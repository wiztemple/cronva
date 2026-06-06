import { runSyncOnce } from '../lib/cron/sync'

runSyncOnce().catch((err) => {
  console.error(err)
  process.exit(1)
})
