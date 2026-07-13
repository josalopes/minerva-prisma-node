// "use client"
// import { Command } from "cmdk"

// export function ProductAutocomplete({ products, onSelect }) {
//   return (
//     <Command className="border rounded p-2">
//       <Command.Input placeholder="Buscar produto..." />
//       <Command.List>
//         {products.map(p => (
//           <Command.Item
//             key={p.id}
//             onSelect={() => onSelect(p.id)}
//           >
//             {p.name} — R$ {p.price}
//           </Command.Item>
//         ))}
//       </Command.List>
//     </Command>
//   )
// }
