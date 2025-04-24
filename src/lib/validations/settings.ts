
import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number().optional(),
  empresa_id: z.string(),
  instancia: z.string().optional().default(""),
  ativo: z.boolean().default(true).optional(),
  horario_limite: z.coerce.number().min(0).max(23).optional().nullable(),
  long_wait_min: z.coerce.number().min(1).optional().nullable(),
  long_wait_max: z.coerce.number().min(1).optional().nullable(),
  short_wait_min: z.coerce.number().min(1).optional().nullable(),
  short_wait_max: z.coerce.number().min(1).optional().nullable(),
  batch_size_min: z.coerce.number().min(1).optional().nullable(),
  batch_size_max: z.coerce.number().min(1).optional().nullable(),
  url_api: z.string().optional().default(""),
  apikey: z.string().optional().default(""),
  webhook_disparo: z.string().optional().default(""),
  webhook_get_images: z.string().optional().default(""),
  webhook_up_docs: z.string().optional().default(""),
  webhook_instancias: z.string().optional().default(""),
  ftp_url: z.string().optional().default(""),
  ftp_user: z.string().optional().default(""),
  ftp_port: z.coerce.number().optional().default(21),
  ftp_password: z.string().optional().default(""),
  numero_de_contatos: z.number().optional().nullable(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
