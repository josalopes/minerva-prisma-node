import { apiRequest } from '@/lib/api-client'

import {
  transactionResponseSchema,
  TransactionResponse,
} from '@saas/contracts/transaction/transaction'

type Props = {
  items: { productId: string; quantity: number }[] //Item[]
  slug: string
  transactionType: 'COMPRA' | 'VENDA'
}

export function createTransactionAction(
  props: Props,
): Promise<TransactionResponse> {
  return apiRequest(
    `organization/${props.slug}/transaction`,
    {
      method: 'POST',

      body: JSON.stringify({
        transactionType: props.transactionType,
        items: props.items,
      }),
    },

    transactionResponseSchema,
  )
}
