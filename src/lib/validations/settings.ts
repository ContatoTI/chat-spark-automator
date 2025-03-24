
import { z } from 'zod';

export const settingsSchema = z.object({
  instancia: z.string().min(1, { message: 'A instância é obrigatória' }),
  Ativo: z.boolean(), // Changed from lowercase 'ativo' to match DB schema 'Ativo'
  producao: z.boolean(),
  limite_disparos: z.number().int().min(1, { message: 'O limite mínimo é 1' }),
  enviados: z.number().int().min(0, { message: 'O valor mínimo é 0' }),
  horario_limite: z.number().int().min(0, { message: 'O valor mínimo é 0' }).max(23, { message: 'O valor máximo é 23' }),
  long_wait_min: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  long_wait_max: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  shortWaitMin: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  shortWaitMax: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  batchSizeMin: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  batchSizeMax: z.number().int().min(1, { message: 'O valor mínimo é 1' }),
  urlAPI: z.string().url({ message: 'URL inválida' }).min(1, { message: 'A URL é obrigatória' }),
}).refine(data => data.long_wait_min <= data.long_wait_max, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["long_wait_min"],
}).refine(data => data.shortWaitMin <= data.shortWaitMax, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["shortWaitMin"],
}).refine(data => data.batchSizeMin <= data.batchSizeMax, {
  message: "O valor mínimo deve ser menor ou igual ao valor máximo",
  path: ["batchSizeMin"],
});
