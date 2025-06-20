import { z } from "zod";

export const createProposalSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "O título da proposta tem que ter pelo menos 2 caracteres." })
      .max(100, { message: "O título da proposta tem que ter menos de 100 caracteres." }),

    content_text: z
      .string()
      .max(5000, { message: "O texto da proposta tem que ter menos de 5000 caracteres." })
      .optional()
      .or(z.literal("")),

    content_video: z
  .union([z.string(), z.instanceof(File)])
  .optional()
  .refine(
    (val) => {
      if (!val) return true; // optional
      if (val instanceof File) return true;
      try {
        new URL(val); // validate string is a URL
        return true;
      } catch {
        return false;
      }
    },
    { message: "Erro no upload do vídeo." }
  ),
  content_video_url: z
  .string()
  .optional(),

    tags: z
      .array(
        z
          .string()
          .min(1, { message: "Cada tag precisa ter pelo menos 1 caracter." })
          .max(30, { message: "Cada tag precisa ter no máximo 30 caracteres." })
      )
      .max(10, { message: "Você pode adicionar no máximo 10 tags." })
      .optional(),
  })
  .refine(
    (data) =>
      (data.content_text ?? "").trim().length > 0 ||
      (typeof data.content_video === "string"
        ? data.content_video.trim().length > 0
        : !!data.content_video),
    {
      message: "A proposta precisa de ter ou um vídeo ou texto.",
      path: ["content_text", "content_video"], 
    }
  );


export type CreateProposalSchema = typeof createProposalSchema;