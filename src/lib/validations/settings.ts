
import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number().optional(),
  empresa_id: z.string().optional(),
  instancia: z.string().optional(),
  ativo: z.boolean().default(true),
  horario_limite: z.coerce.number().min(0).max(23),
  long_wait_min: z.coerce.number().min(1),
  long_wait_max: z.coerce.number().min(1),
  short_wait_min: z.coerce.number().min(1),
  short_wait_max: z.coerce.number().min(1),
  batch_size_min: z.coerce.number().min(1),
  batch_size_max: z.coerce.number().min(1),
  url_api: z.string().optional(),
  apikey: z.string().optional(),
  webhook_disparo: z.string().optional(),
  webhook_contatos: z.string().optional(),
  webhook_get_images: z.string().optional(),
  webhook_up_docs: z.string().optional(),
  webhook_instancias: z.string().optional(), // Novo campo adicionado
  ftp_url: z.string().optional(),
  ftp_user: z.string().optional(),
  ftp_port: z.coerce.number().default(21),
  ftp_password: z.string().optional(),
  numero_de_contatos: z.number().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
