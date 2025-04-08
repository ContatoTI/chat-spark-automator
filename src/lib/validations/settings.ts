
import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number().optional(),
  empresa_id: z.string().optional(),
  instancia: z.string().optional(),
  Ativo: z.boolean().default(true),
  horario_limite: z.coerce.number().min(0).max(23),
  long_wait_min: z.coerce.number().min(1),
  long_wait_max: z.coerce.number().min(1),
  ShortWaitMin: z.coerce.number().min(1),
  ShortWaitMax: z.coerce.number().min(1),
  BatchSizeMim: z.coerce.number().min(1),
  BatchSizeMax: z.coerce.number().min(1),
  urlAPI: z.string().optional(),
  apikey: z.string().optional(),
  webhook_disparo: z.string().optional(),
  webhook_contatos: z.string().optional(),
  webhook_get_images: z.string().optional(),
  webhook_up_docs: z.string().optional(),
  ftp_url: z.string().optional(),
  ftp_user: z.string().optional(),
  ftp_port: z.coerce.number().default(21),
  ftp_password: z.string().optional(),
  numero_de_contatos: z.number().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
