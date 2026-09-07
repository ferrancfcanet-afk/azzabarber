import { createClient } from '@supabase/supabase-js'

// La "anon key" (o "publishable key") está pensada para ir en el bundle
// público del cliente — no es un secreto. El control de acceso real lo
// hacen las políticas RLS en la base de datos.
export const SUPABASE_URL = 'https://rpedvcnlbizrnxspezya.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_N8ksRL9b7YO4mueqUCj9ww_aARmEqaS'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Email interno fijo para la única cuenta de administrador (el dueño).
// El PIN que introduce en el panel es, por debajo, la contraseña de esta cuenta.
export const ADMIN_EMAIL = 'barbero@azzabarber.internal'

export function mediaPublicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`
}
