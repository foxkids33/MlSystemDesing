import type {LayoutServerLoad} from "./$types";


export const load: LayoutServerLoad = async(event) => {
    return {
        session: await event.locals.auth(),
        //token: SEMINARIAN_API_TOKEN,  //to ensure that .env is loaded correctly
        //api_url: SEMINARIAN_API_URL
    }
}

