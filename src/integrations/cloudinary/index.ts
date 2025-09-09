import { Cloudinary } from '@cloudinary/url-gen'
import { getBindings } from '@/utils/bindings'

export const cld = new Cloudinary({
  cloud: {
    cloudName: getBindings().CLOUDINARY_CLOUD_NAME || '',
    apiKey: getBindings().CLOUDINARY_API_KEY || '',
    apiSecret: getBindings().CLOUDINARY_API_SECRET || '',
  },
})
