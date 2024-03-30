import { ProductType } from '@/types/types'
import { Index } from '@upstash/vector'
import * as dotenv from 'dotenv'

dotenv.config()

export const db = new Index<ProductType>()