# Cron Jobs for Supabase Keep-Alive

This directory contains API routes designed to be called by scheduled cron jobs to keep the Supabase instance active.

## Why This Is Needed

Supabase's free tier puts database instances to sleep after periods of inactivity. This can cause unexpected timeouts or slow responses when users access the application after it hasn't been used for a while.

## Cron Job Setup Instructions

### Using Vercel Cron Jobs (Recommended)

If your app is hosted on Vercel, you can use their built-in cron job functionality:

1. Add the following to your `vercel.json` file at the root of your project:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

This will call your keep-alive endpoint every 10 minutes.

### Using External Cron Job Services

If you're not using Vercel, or prefer an external service, you can use one of these alternatives:

#### Uptime Robot

1. Create a free account at [Uptime Robot](https://uptimerobot.com/)
2. Add a new "HTTP(s)" monitor
3. Set the URL to your deployed keep-alive endpoint: `https://your-site.com/api/cron/keep-alive`
4. Set the monitoring interval to every 10 minutes

#### Cron-job.org

1. Create a free account at [Cron-job.org](https://cron-job.org/)
2. Add a new cronjob
3. Set the URL to your deployed keep-alive endpoint
4. Set the execution schedule to every 10 minutes

## Security Considerations

For added security, you might want to add authentication to your keep-alive endpoint so only authorized services can trigger it. This can be done by:

1. Adding a secret key to your environment variables
2. Checking for this key in the Authorization header of requests to your endpoint
3. Only processing the request if the key matches
