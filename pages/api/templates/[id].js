import TemplatesMode from "../../../models/template";




export const config = {
    api: {
        bodyParser:false
    }
}

export default async function apiHandler(req, res) { 
    const { method } = req;
    switch (method) { 
        case "GET":
            const { id } = req.query;
            console.log({id});
            try {
                // const templates = await TemplatesMode.findById(id);
                // return res.status(200).json({
                //     success: true,
                //     templates
                // })
            } catch (error) {
                console.log({error});
                return res.status(500).json({ success: false });
            }   
        default:
            return res.status(400).json({ success: false });
    }
}