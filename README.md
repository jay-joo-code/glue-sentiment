# Glue

Glue aims to be an extremely opinionated design system, frontend, backend, database framework. It shares many design patterns and best practices across all of my web apps. It "glues" them together.

After building ~20 full-stack web apps, I realized that most websites follow a large set predicatable design patterns. If I'm able to capture this large set in a framework, I'll never have to write duplicate code for a design pattern I've implemented in the past.

It's currently closer to a glorified full-stack boilerplate. But I hope to build a full-stack framework some day. Opinionated frameworks limit customizability, but I hope to expand Glue to support all possible "common" variations of a web app.

I think this will be possible from a UX perspective rather than a software one. Users don't like UX that they've never experienced before. This encourages web builders to imitate UX that have been commonly implemented. If the intended UX repeats, so do design patterns to implement that UX.

Glue is the culmination of my ~5 years of full-stack web development. It's my ultimate pet project that I hope to cultivate until either the web or I am gone from this world. If Glue survives until my 30s or 40s, I hope to rename it to a more human name and consider it my "baby".

# Initial setup

- [ ] import this repo to clone it (click on the + sign at the top right side of the page)
- [ ] duplicate .env.glue and rename to .env

**Add glue remote**

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

# Integrations

### Database

1. [Create a new Supabase project](https://app.supabase.com/)
2. [Copy the database connection string](https://app.supabase.com/project/nsjhrzynvgbhontxkobx/settings/database)
3. [Create a new Prisma Data Platform project](https://cloud.prisma.io/projects/create)
4. Follow the steps to create a new project.
5. Copy paste the connection strings into .env. Make sure to add the query parameters in the dev connection string postgres://...

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

### Error tracking (Sentry)

1. [Create a new Sentry project](https://sentry.io/organizations/jay-joo-org/projects/new/) 2. Create a new project under Jay Joo Org (do not create a new org or Sentry account) 3. Select Next.js 4. Select alert me on every issue for Issue Alerts 5. Select all for Performance Alerts 6. Update project name 7. Add `NEXT_PUBLIC_SENTRY_DSN` to env variable (only required in production)

**Notes**

- Errors will only be sent to Sentry if env variable `BUILD_ENV` is set to `production`
- I should not create a new Sentry account or org, because the jj534@cornell.edu Vercel account won't be able to integrate with a different Sentry account or org
- I also can't create multiple Vercel accounts to bypass this issue, because their phone number verification only allows for 1 account per phone number
- I could bypassing it by creating a new Github account and sign up a new Vercel account with that Github account, but honestly it's way too much work

### Deployment (Vercel)

1. Make sure I have a Sentry project set up
2. Create a new Vercel account with the project email
   1. Creating a new project in the same account leads to a sentry integration bug.
3. [Create a new Vercel project](https://vercel.com/new)
   1. Make sure to add all environment variables
   2. `DATABASE_URL_PROD` should be saved as `DATABASE_URL`. All other env vars have the same name as the local env vars.
   3. Add `?schema=public&connection_limit=1` at the end of the `DATABASE_URL` env variable to prevent the [too many database connections error](https://stackoverflow.com/questions/71259682/prisma-is-opening-too-many-connections-with-postgrsql-when-running-jest-end-to-e).
   4. Add `&schema=public&connection_limit=1` instead if it's not the first url query.
4. Vercel project > Settings > Integrations > Browse Marketplace > Add Sentry integration (follow through the steps in the popup window)
5. Check that Sentry env variables were automatically added.
6. Redeploy (build should succeed)
7. (If you haven't yet) Add Vercel production endpoint to OAuth providers' redirect URLs.

**Notes**

- If the [too many database connections error](https://stackoverflow.com/questions/71259682/prisma-is-opening-too-many-connections-with-postgrsql-when-running-jest-end-to-e) keeps coming up, just wait 30-60 minutes. The error should go away.

### Better Uptime (preventing cold starts)

- a limitation of serverless functions is that they are super slow if the function hasn't been used in a while. this is known as a cold start
- too keep the load speeds of important pages low, we need to keep the lambda functions for those pages "warm"
- [Better Uptime](https://betterstack.com/better-uptime) is used to periodically ping the page to keep the corresponding lambda function warm

1. Create a [Better Uptime](https://betterstack.com/better-uptime) account with the project email
2. Add the pages that are important to the web app, such as frequently visited pages or conversion pages
