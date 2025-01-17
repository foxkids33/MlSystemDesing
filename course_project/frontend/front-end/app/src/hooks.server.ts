// hooks.server.ts

// This file is used to define server-side hooks in a SvelteKit application.
// Server-side hooks run during the request lifecycle and can be used to modify requests and responses.
// Common use cases include authentication, logging, setting custom headers, and handling errors.

// By exporting the 'handle' function from the 'auth' configuration, we ensure that every incoming request
// goes through the authentication logic defined in 'auth.ts'. This allows us to manage user authentication,
// token validation, and other related tasks in a centralized manner.

export {handle} from "./auth"

