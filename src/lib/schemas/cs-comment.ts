import { z } from "zod";

export const createCommentSchema = z
  .object({
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
  })
  .refine(
    (data) =>
      (data.content_text ?? "").trim().length > 0 ||
      (typeof data.content_video === "string"
        ? data.content_video.trim().length > 0
        : !!data.content_video),
    {
      message: "O comentário precisa de ter ou um vídeo ou texto.",
      path: ["content_text", "content_video"], 
    }
  );

export type CreateCommentSchema = typeof createCommentSchema;