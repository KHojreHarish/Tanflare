import { Resend } from 'resend'
import { getBindings } from '@/utils/bindings'

// Initialize Resend client
export const resend = new Resend(getBindings().RESEND_API_KEY)
