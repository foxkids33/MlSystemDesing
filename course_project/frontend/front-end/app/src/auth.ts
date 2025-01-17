import {SvelteKitAuth} from "@auth/sveltekit";
import Github from "@auth/sveltekit/providers/github"
import {AUTH_GITHUB_SECRET, AUTH_GITHUB_ID} from "$env/static/private"

export const {handle} = SvelteKitAuth({
    providers: [
        Github({clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET})
    ],

    // Where we get the access token
    callbacks:{
        async jwt({token, account}) {
            if(account){
                token.accessToken = account.access_token
            }
            return token
        },
        async session ({session, token, user}){
            // @ts-ignore
            session.access_token = token.accessToken
            return session
        }
    }
})