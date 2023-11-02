import categoryModel from "../../../models/category";
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
                const categories = await categoryModel.find({});
                return res.status(200).json({
                    success: true,
                    category:categories
                 })
            case "POST":
                  const body = await parseForm(req);
                const { category, templates } = body.field;
                await  TemplatesMode.create({
                    category,
                    templates
                })
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