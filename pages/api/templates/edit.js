import TemplatesMode from "../../../models/template";

import dbConnect from "~/utils/dbConnect";
import { parseForm } from "~/utils/parseForm";


export const config = {
    api: {
        bodyParser:false
    }
}

export default async function apiHandler(req, res){
    const { method } = req;
    

    
    try {
        await dbConnect();


        switch (method) {
            case "GET":
                const id = req.query.id;
                const template = await TemplatesMode.findById(id);
                return res.status(200).json({
                    success: true,
                    template
                 })
            case "POST":
                  const body = await parseForm(req);
                const { category, templates, id: temId } = body.field;
                console.log(body.field);
                
                
                await TemplatesMode.findByIdAndUpdate(temId,{ category, templates })
                return  res.status(200).json({
                    success: true
                })
            default:
               return res.status(400).json({ success: false });
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
}