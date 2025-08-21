import { z } from "zod";

const TemplateSchema = z.object({
  name: z.string().trim(),
  content: z.string().trim(),
  tags: z.array(z.string().trim()).optional(),
});

export default TemplateSchema;
