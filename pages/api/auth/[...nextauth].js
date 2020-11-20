import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const providers = [
    Providers.Credentials({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        authorize: async (credentials) => {
            // Add logic here to look up the user from the credentials supplied
            const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

            if (user) {
                // Any object returned will be saved in `user` property of the JWT
                return Promise.resolve(user)
            } else {
                // If you return null or false then the credentials will be rejected
                return Promise.resolve(null)
                // You can also Reject this callback with an Error or with a URL:
                // return Promise.reject(new Error('error message')) // Redirect to error page
                // return Promise.reject('/path/to/redirect')        // Redirect to a URL
            }
        }
    })
];

if (GetEnvBool('GITHUB_ENABLE')) {
    providers.push(
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    )
}

if (GetEnvBool('APPLE_ENABLE')) {
    providers.push(
        Providers.Apple({
            clientId: process.env.APPLE_ID,
            clientSecret: {
                appleId: process.env.APPLE_ID,
                teamId: process.env.APPLE_TEAM_ID,
                privateKey: process.env.APPLE_PRIVATE_KEY,
                keyId: process.env.APPLE_KEY_ID,
            }
        })
    )
}

if (GetEnvBool('FACEBOOK_ENABLE')) {
    providers.push(
        Providers.Facebook({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET
        })
    )
}

if (GetEnvBool('GOOGLE_ENABLE')) {
    providers.push(
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    )
}

const options = {
    providers,
    secret: process.env.SECRET,
    // A database is optional, but required to persist accounts in a database
    database: process.env.DATABASE_URL,
}

/**
 * Gets the specified environment variable and return it as a boolean state.
 * @param {String} variable_name The name of the envirmnment variable.
 * @param {Boolean} default_value The default value if the variable does not exist. (false, by default)
 * @returns true if variable is any variantion of true, otherwise false.
 */
function GetEnvBool(variable_name, default_value = false) {
    let result = default_value;

    if (!!process.env[variable_name])
        result = String(true) === process.env[variable_name].toLowerCase()

    return result;
}

export default (req, res) => NextAuth(req, res, options)