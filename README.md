# GrowthBook Jira App

An Atlassian Forge app for use linking Jira issues to GrowthBook features and experiments.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

### Notes

- Use the `forge tunnel` command to enable hot-reloading between your computer and the development environment.
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Connecting to a self-hosted GrowthBook instance

Forge apps must specify what urls they connect to before they're published, so to use this app with a non-cloud
instance of GrowthBook you'll need to fork this repo and change the `manifest.yml` like so:

```diff
diff --git a/manifest.yml b/manifest.yml
index 9dfac39..bc18c2f 100644
--- a/manifest.yml
+++ b/manifest.yml
@@ -33,4 +33,4 @@ permissions:
   external:
     fetch:
       client:
-        - "https://api.growthbook.io"
+        - "https://your-site-here.com"
```

You'll also need to change the URLs in [/src/utils/consts.ts](src/utils/consts.ts) to point to your site
