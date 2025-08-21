import { z } from "zod";
import TeamSchema from "../schema/team/teamSchema";

export type TeamDTO = z.infer<typeof TeamSchema>;