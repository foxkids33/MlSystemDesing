# Smart Seminarian Frontend

[![Build docker image](https://github.com/SmartSeminarian/front-end/actions/workflows/on-push-main.yml/badge.svg)](https://github.com/SmartSeminarian/front-end/actions/workflows/on-push-main.yml)

This repository describes the frontend of the smart seminarian. The Wireframe and UI/UX Design of the frontend can be found here on [Figma](https://www.figma.com/design/3uktwiRfEoWQIdEwH75HTO/TEG-Workshop?node-id=0-1&t=JH0tdJCOj7aV535k-1). 

## Figma Design
The Design Files on Figma are structured as followed: 
1. **UI Design**: Files of the UI Design, Wireframes, Transitions
2. **Moodboard**: Inspiration for UI Design, Color palettes and Typography

## Framework Choice for Frontend: [Svelte](https://svelte.dev/)

1. **Performance**:
    - **Fast and Efficient**: Svelte compiles code into highly optimized JavaScript, which makes pages load faster and improves performance.
    - **No Virtual DOM**: Unlike other frameworks, Svelte skips the virtual DOM, reducing overhead and speeding things up. It is very lightweight

2. **Developer Experience**:
    - **Reactive Programming**: Svelte's reactivity model makes managing state easier and the code more understandable.
    - **Single File Components**: You can write HTML, CSS, and JavaScript in a single file, making components more self-contained and manageable.
    - **TypeScript Support**: Great TypeScript support helps catch errors early and offers better tooling.

3. **Ease of Use**:
    - **Less Boilerplate**: SvelteKit cuts down on boilerplate code, so we can focus more on writing logic instead of configuring stuff.
    - **Simplified Routing**: The file-based routing system is intuitive and easy to set up.

4. **SEO and Accessibility**:
    - **Server-Side Rendering (SSR)**: SvelteKit comes with SSR support out of the box, which helps with SEO and initial load times.
    - **Progressive Enhancement**: Ensures the application works for everyone, regardless of their browser's capabilities.

5. **Flexibility**:
    - **Static Site Generation**: SvelteKit can generate static sites, making the app more scalable and reducing server load.
    - **Hybrid Apps**: You can create hybrid apps that use both SSR and client-side rendering.

6. **Community and Ecosystem**:
    - **Growing Community**: There's a rapidly growing community with lots of resources, tutorials, and plugins.
    - **Rich Ecosystem**: Integrates well with tools and services like Vite, and has adapter support for different deployment platforms.

7. **Modern Tooling**:
    - **Vite Integration**: SvelteKit uses Vite, which provides a modern development experience with hot module replacement and fast builds.
    - **Built-In State Management**: Svelte's built-in stores simplify state management.

