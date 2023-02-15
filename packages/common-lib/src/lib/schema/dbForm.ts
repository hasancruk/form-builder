import { z } from "zod";

export const createForm = z.object({
  formName: z.string(),
});

export type CreateFormType = z.infer<typeof createForm>;

export const mutateForm = z.object({
  formId: z.string(),
});

export const dbForm = z.object({
  formStatus: z.union([
    z.literal("created"),
    z.literal("orphaned"),
    z.literal("issued"),
    z.literal("archived"),
  ]),
  dataCreated: z.date(),
  dateUpdated: z.date(),
}).merge(createForm).merge(mutateForm);

export type DBFormType = z.infer<typeof dbForm>;

// export default dbForm;
