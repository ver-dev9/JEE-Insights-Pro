# Deployment: GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the Vite app and publishes the `dist` directory.

## One-time repository setup
1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Ensure GitHub Actions is enabled for the repository.
4. Push to `main` or manually run the Deploy to GitHub Pages workflow from the Actions tab.

Expected URL: https://ver-dev9.github.io/JEE-Insights-Pro/

The URL is not considered live until the workflow succeeds and the URL loads in a browser. If deployment fails because Pages is not enabled, complete the one-time setup above and rerun the workflow.
