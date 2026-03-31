import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const organizationId = formData.get("organizationId") as string;

    if (!organizationId || organizationId === "") {
        return NextResponse.json({ error: "Falha ao alterar a imagem" }, { status: 401 });
    }
    
    if (!file) {
        return NextResponse.json({ error: "O arquivo a enviar é obrigatório" }, { status: 400 });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return NextResponse.json({ error: "Tipo de arquivo inválido" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            tags: [`${organizationId}`],
            public_id: file.name,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }).end(buffer);

    })
    // console.log(results);

    return NextResponse.json(results);
}