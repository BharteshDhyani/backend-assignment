import { z } from "zod";
import TemplateSchema from "../schema/template/TemplateSchema";

export type TemplateDTO = z.infer<typeof TemplateSchema>
