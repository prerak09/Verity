"use server";

// features/students/actions.ts — student profile mutations (PRD §14.1, FR profile).
// A student edits only their OWN profile (Layer 2: profile:update:own).

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { updateStudentProfileSchema } from "./schema";
import { getStudentProfile } from "./queries";
import { NotFoundError, type Result, type StudentProfileDTO, type StudentProfileInput } from "@/types";

export async function updateStudentProfile(
  input: StudentProfileInput,
): Promise<Result<StudentProfileDTO>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "profile:update:own");

    const data = parseInput(updateStudentProfileSchema, input);
    const { name, ...profileFields } = data;

    await db.$transaction(async (tx) => {
      // `name` lives on User; profile fields on StudentProfile (Layer 3: own id).
      if (name !== undefined) {
        await tx.user.update({ where: { id: user.id }, data: { name } });
      }
      await tx.studentProfile.upsert({
        where: { userId: user.id },
        update: profileFields,
        create: { userId: user.id, ...profileFields },
      });
    });

    const profile = await getStudentProfile(user.id);
    if (!profile) throw new NotFoundError("Profile not found after update.");
    return profile;
  });
}
