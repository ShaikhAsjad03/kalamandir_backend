const { generateContent } = require("../helpers/generativeAi");
const autoGenerate=async(req,res)=>{
    try{
         const { sku, productCategory, description,Metal, } = req.body;
         const prompt = `
      Create 5 attractive, SEO-friendly product titles for the following product:
      SKU: ${sku}
      Metal: ${Metal}
      Category: ${productCategory}
      Description: ${description}
      Please return each title on a new line and make sure they are concise and catchy.
    `;
    const text = await generateContent(prompt);
    const generatedText = text.parts?.map(p => p.text).join("\n") || "";
    const titles = generatedText
      .split("\n")
      .map(t => t.replace(/^\d+\.\s*/, "").trim()) 
      .filter(t => t.length > 0)
      .slice(0, 5)
      .map(t => `${sku} - ${t}`); 

    res.json({ titles ,isSuccess:true,"message":"Title genrated successfully"});

    }catch(error){
return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
    }
}


module.exports={autoGenerate}