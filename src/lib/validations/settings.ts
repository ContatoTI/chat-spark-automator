
import { z } from 'zod';

export const settingsSchema = z.object({
  instancia: z.string().min(1, { message: 'A instância é obrigatória' }),
  Ativo: z.boolean(),
  Producao: z.boolean(),
  Limite_disparos: z.number().int().min(1, { message: 'O limite mínimo é 1' }),
  Enviados: z.number().int().min(0, { message: 'O valor mínimo é 0' }),
  horario_limite: z.number().int().min(0, { message: 'O valor mínimo é 0' }).max(23, { message: 'O valor máximo é 23' }),
  long_wait_min: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  long_wait_max: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  ShortWaitMin: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  ShortWaitMax: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  BatchSizeMim: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  BatchSizeMax: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  urlAPI: z.string().url({ message: 'URL inválida' }).min(1, { message: 'A URL é obrigatória' }),
  apikey: z.string().min(1, { message: 'A chave de API é obrigatória' }),
}).refine(data => data.long_wait_min <= data.long_wait_max, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["long_wait_min"],
}).refine(data => data.ShortWaitMin <= data.ShortWaitMax, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["ShortWaitMin"],
}).refine(data => data.BatchSizeMim <= data.BatchSizeMax, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["BatchSizeMim"],
});
