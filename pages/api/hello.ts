import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let user: string;
    let error: {
        message: string
    } = {message:""};

    try {
        const session = await getSession({ req });
        if (!session) {
            error.message = "No session";
        }
        else if (!session.user) {
            error.message = 'No user in session'
        }
        else {
            user = session.user.email || session.user.name;
        }
    } catch (err) {
        console.log('deu erro');
        console.log(err);
        
        // error.message = JSON.stringify(err);
    }
    res.status(200)
        .send('<pre>' + JSON.stringify({
            text: 'Hello',
            user,
            error
        }, null, 2) + '</pre>')
}