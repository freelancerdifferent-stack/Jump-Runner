# Jump Runner

A lightweight Android arcade platformer under active development.

## Engineering workflow

Every change follows the same gate:

1. Create a feature branch from `main`.
2. Make one coherent change set.
3. Open a pull request.
4. GitHub Actions must pass JavaScript validation, Android lint, and debug APK assembly.
5. Review the PR and merge only after CI is green.
6. The merge to `main` triggers a fresh APK build.
7. Verify the `main` build is green before starting the next feature branch.

## CI diagnostics

Every workflow run uploads a `ci-diagnostics-<run_id>` artifact, even when the build fails. It contains `latest.log` and a compact `summary.log` with the relevant validation, SDK, lint, and Gradle output.

## Current scope

APK-only development. AdMob, IAP, and Play Store AAB work are intentionally deferred until gameplay and product quality are mature.
