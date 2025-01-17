# create-svelte
[![Build docker image](https://github.com/SmartSeminarian/front-end/actions/workflows/on-push-main.yml/badge.svg)](https://github.com/SmartSeminarian/front-end/actions/workflows/on-push-main.yml)

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Developing](#developing)
- [Building](#building)
- [Folder Structure](#folder-structure)

## Prerequisites
You need to have installed the following: 

- npm 
- docker

## Installation

How to install the project: 
```bash
# clone the repository
git clone https://github.com/SmartSeminarian/front-end.git
```
```bash
# navigate to the project directory
cd smart-seminarian-frontend
```
```bash
# install dependencies
npm install
```

## Initialize Secrets in .env 
You need to create a .env file with the following secrets.
How to find the GitHub Token

1. Go to your GitHub account > Settings > Developer Settings > OAuth Apps > New OAuth App then create a new App
2. For the Homepage URL: http://localhost:5173/ (or do http://localhost:5000 if you test with docker)
3. For the Authorization Callback URL: http://localhost:5173/auth/callback/github (or do http://localhost:5000/auth/callback/github if you test with docker)
4. You will need to generate a random 32 characters long string like this AUTH_SECRET="a9c344fe92e712c3b8bc584a04376a8d" (for that you can just call https://generate-secret.vercel.app/32 and take the string that is generated there)

```
AUTH_GITHUB_ID=<Github Client ID>
AUTH_GITHUB_SECRET=<Github Client Secret>
AUTH_SECRET=<32 Char Long Random String>
SEMINARIAN_STAGE_API_URL=https://api-stage.csai.site/
SEMINARIAN_API_URL=<The API URL> (for me it is this: http://localhost:5050/) 
SEMINARIAN_API_TOKEN=<API Token from our api> (f.e.: test:VongOahophufshepwucsimyig5ogukir)
VITE_API_URL=http://localhost:5050 
```

environment variable must still be prefixed with VITE_ because SvelteKit requires this prefix for exposing environment variables to the frontend!

## Developing (locally)

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Developing (Docker)

```
# Initialize envivonment variables
./init-local-env.sh
```
```
# Start containers
docker compose up --build
```

## Testing 
To run the tests simply run the following command: 

```
npm test 
```

## Building

To create a production version of your app:

```bash
npm run build
```


You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Folder Structure

- **.svelte-kit/**: Contains SvelteKit specific build artifacts. This directory is generated during the build process and should not be modified manually.

- **node_modules/**: Contains all the project's dependencies installed via npm or yarn.

- **src/**: The main source directory for the application.
    - **lib/**: Contains reusable modules and utilities.
        - **assets/**: Static assets like images or fonts.
        - **components/**: Reusable Svelte components.
        - **index.ts**: Entry point for exporting modules from the `lib` directory.
        - **utils.ts**: Utility functions used throughout the application.
    - **routes/**: Contains the application’s route components and pages.
        - **dashboard/**: Contains the components and pages related to the dashboard route.
        - **login/**: Contains the components and pages related to the login route.
        - **signup/**: Contains the components and pages related to the signup route.
        - **+layout.svelte**: Svelte component that defines the layout for the routes.
        - **+page.svelte**: Main page component for the root route.
    - **app.css**: Global styles for the application.
    - **app.d.ts**: TypeScript declaration file for global types.
    - **app.html**: Main HTML file for the application.

- **static/**: Contains static files that are served directly without processing (f.e. favicon)
- **.npmrc**: Configuration file for npm, used to set custom npm settings.
