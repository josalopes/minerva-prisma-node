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
    const type = formData.get("type") as string;

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

    const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            tags: [`${organizationId}`],
            public_id: `organizations/${organizationId}/${type}`,
            overwrite: true,
            unique_filename: false,
            use_filename: false,
            invalidate: true,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }).end(buffer);

    })

    return NextResponse.json({
        secure_url: result.secure_url,
        public_id: result.public_id,
    });
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    const public_id = body.public_id as string

    // =========================
    // 🔥 VALIDATION
    // =========================
    if (!public_id || public_id.trim() === "") {
      return NextResponse.json(
        {
          error: "public_id é obrigatório"
        },
        {
          status: 400
        }
      )
    }

    // =========================
    // 🔥 DELETE CLOUDINARY
    // =========================
    const result = await cloudinary.uploader.destroy(
      public_id,
      {
        invalidate: true,
        resource_type: "image"
      }
    )

    // =========================
    // 🔥 NOT FOUND
    // =========================
    if (result.result === "not found") {
      return NextResponse.json(
        {
          error: "Arquivo não encontrado"
        },
        {
          status: 404
        }
      )
    }

    // =========================
    // 🔥 SUCCESS
    // =========================
    return NextResponse.json({
      success: true,
      result: result.result,
      public_id
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao excluir arquivo"
      },
      {
        status: 500
      }
    )
  }
}