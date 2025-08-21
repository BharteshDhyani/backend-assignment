import { z } from 'zod';
enum MemberStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
const MemberSchema = z.object({
  member: z.string(),
  joined_on: z.string().datetime(),
  invited_at: z.string().datetime(),
  status: z
    .nativeEnum(MemberStatus)
    .default(MemberStatus.PENDING),
});

const TeamSchema = z.object({
  name: z.string(),
  teamAdmin: z.string(),
  members: z.array(MemberSchema),
  owner: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export default TeamSchema;
