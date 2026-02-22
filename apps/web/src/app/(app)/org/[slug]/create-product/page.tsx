'use client'

import { ability } from "@/auth/auth";
import { ProductForm } from "./product-form";
import { redirect } from "next/navigation";
// import { DialogProduct } from "../(products)/dialog-product";
import { useState } from "react";

export default async function CreateProject() {
    const [isDialogOpened, setIsDialogOpened] = useState(false);
    // const [editingService, setEditingService] = useState<null | Service>(null);
    
    // const permissions = await ability()

    // if (permissions?.cannot('get', 'Project')) {
    //     redirect('/')
    // }
    
    // return (
    //     <div className="space-y-4">
    //         <main className="mx-auto w-full max-w-[1200px] space-y-4">
    //             <h1 className="text-2xl font-bold">Novo Produto</h1>    
            
    //             <DialogProduct 
    //                 closeModal={() => { 
    //                              setIsDialogOpened(false);
    //                             //  setEditingService(null) ;
    //                           }}
    //             />
    //             {/* <ProductForm /> */}
    //         </main>
    //     </div>
    // )
}