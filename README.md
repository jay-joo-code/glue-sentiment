# Sentiment

# Setup

### General

- [ ] import this repo to clone it (click on the + sign at the top right side of the page)
- [ ] rename .env.glue to .env
- [ ] add glue remote:

```bash
git remote add glue https://github.com/jay-joo-code/glue-root.git
git fetch --all
git switch -c glue-master glue/master
```

# Scripts

**Pushing specific commits to Glue root**

```bash
$ git checkout glue-master
$ git cherry-pick <commit-hash>
$ git push
```

**Setting upstream to glue/master**

```bash
$ git branch -u glue/master
```

**Push to glue/master**

```bash
git push glue glue-master:master
```

### Database

1. [Create a new Prisma Data Platform project](https://cloud.prisma.io/projects/create)
2. Follow the steps to create a new project.
3. Copy paste the connection strings:

- `DATABASE_URL=postgres://...?connection_limit=10&connect_timeout=30&pool_timeout=30&socket_timeout=30`
- `DATABASE_URL_PROD=prisma://...`

### Google auth

1. [Go to Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. [Configure OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

- no scopes necessary for basic authentication

4. Create an OAuth Client ID `https://console.cloud.google.com/apis/credentials`

- Authorized JavaScript origins
  - http://localhost:3000
  - https://(app-name).vercel.app
  - https://proddomain.com
  - https://www.proddomain.com
- Authorized redirect URIs
  - http://localhost:3000/api/auth/callback/google
  - https://(app-name).vercel.app/api/auth/callback/google
  - https://proddomain.com/api/auth/callback/google
  - https://www.proddomain.com/api/auth/callback/google

### Google Analytics

- Glue components track usage by default (button click, input focus, debounced input value, etc)
- Setting the `NEXT_PUBLIC_GA_ID`env variable is required (usage tracking is enforced for Glue apps)
- If GA reports don't show up, give it 2 days. It takes time for the usage report data to show up.

### Deployment (Vercel)

1. [Create a new Sentry project](https://sentry.io/organizations/jay-joo-org/projects/new/)
   1. Create a project new under Jay Joo Org
   2. Select Next.js
   3. Select alert me on every issue for Issue Alerts
   4. Select all for Performance Alerts
   5. Update project name
   6. Add `NEXT_PUBLIC_SENTRY_DSN` to env variable (only required in production)
2. [Create a new Vercel project](https://vercel.com/new) (this deployment should fail)
   1. Make sure to add all environment variables
   2. `DATABASE_URL_PROD` should be saved as `DATABASE_URL`. All other env vars have the same name as the local env vars.
   3. Add `?schema=public&connection_limit=1` at the end of the `DATABASE_URL` env variable to prevent the [too many database connections error](https://stackoverflow.com/questions/71259682/prisma-is-opening-too-many-connections-with-postgrsql-when-running-jest-end-to-e)
3. [Configure Vercel integration in Sentry](https://sentry.io/settings/jay-joo-org/integrations/vercel/138276/)
4. Wait 3 - 10 minutes until Sentry env variables are added.
5. Redeploy
6. (If you haven't yet) Add Vercel production endpoint to OAuth providers' redirect URLs.

**Notes**

- If the [too many database connections error](https://stackoverflow.com/questions/71259682/prisma-is-opening-too-many-connections-with-postgrsql-when-running-jest-end-to-e) keeps coming up, just wait 30-60 minutes. The error should go away.

### Better Uptime (preventing cold starts)

- a limitation of serverless functions is that they are super slow if the function hasn't been used in a while. this is known as a cold start
- too keep the load speeds of important pages low, we need to keep the lambda functions for those pages "warm"
- [Better Uptime](https://betterstack.com/better-uptime) is used to periodically ping the page to keep the corresponding lambda function warm

1. Create a [Better Uptime](https://betterstack.com/better-uptime) account with the project email
2. Add the pages that are important to the web app, such as frequently visited pages or conversion pages
