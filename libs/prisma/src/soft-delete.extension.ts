// src/prisma/soft-delete.extension.ts
import { Prisma, PrismaClient } from '@prisma/client';

type SoftDeleteOptions = {
  field?: string;                     // column name, default 'deleted_at'
  excludedModels?: Prisma.ModelName[]; // models without the field
  now?: () => any;                    // value to set (default: new Date())
};

export const createSoftDeleteExtension = (opts: SoftDeleteOptions = {}) => {
  const field = opts.field ?? 'deleted_at';
  const excluded = new Set<Prisma.ModelName>(opts.excludedModels ?? []);
  const now = opts.now ?? (() => new Date());
  const prisma = new PrismaClient();

  return Prisma.defineExtension({
    name: 'soft-delete',

    query: {
      $allModels: {
        // reads
        findFirst({ model, args, query }) {
          if (excluded.has(model as Prisma.ModelName)) return query(args);
          const { withDeleted, onlyDeleted, ...rest } = (args ?? {}) as any;
          const where = rest.where ?? {};
          if (!withDeleted && where[field] === undefined) {
            rest.where = { ...where, [field]: onlyDeleted ? { not: null } : null };
          }
          return query(rest);
        },

        findMany({ model, args, query }) {
          if (excluded.has(model as Prisma.ModelName)) return query(args);
          const { withDeleted, onlyDeleted, ...rest } = (args ?? {}) as any;
          const where = rest.where ?? {};
          if (!withDeleted && where[field] === undefined) {
            rest.where = { ...where, [field]: onlyDeleted ? { not: null } : null };
          }
          return query(rest);
        },

        count({ model, args, query }) {
          if (excluded.has(model as Prisma.ModelName)) return query(args);
          const { withDeleted, onlyDeleted, ...rest } = (args ?? {}) as any;
          const where = rest.where ?? {};
          if (!withDeleted && where[field] === undefined) {
            rest.where = { ...where, [field]: onlyDeleted ? { not: null } : null };
          }
          return query(rest);
        },

        // Prisma can't apply extra filters to findUnique, so we transparently
        // rewrite to findFirst when needed.
        async findUnique(this: any, { model, args, query }) {
          if (excluded.has(model as Prisma.ModelName)) return query(args);
          const { withDeleted, ...rest } = (args ?? {}) as any;
          const where = rest.where ?? {};
          if (withDeleted || where[field] !== undefined) {
            return query(rest);
          }
          return query({ ...rest, where: { ...where, [field]: null } });
        },

        // writes
        async delete(this: any, { model, args }) {
          // @ts-ignore
          if (excluded.has(model as Prisma.ModelName)) return prisma[model].delete(args);
          const { force, ...rest } = (args ?? {}) as any;
          // @ts-ignore
          if (force) return prisma[model].delete(rest);
          // @ts-ignore
          return prisma[model].update({ where: rest.where, data: { [field]: now() } });
        },

        async deleteMany(this: any, { model, args }) {
          // @ts-ignore
          if (excluded.has(model as Prisma.ModelName)) return prisma[model].deleteMany(args);
          const { force, ...rest } = (args ?? {}) as any;
          // @ts-ignore
          if (force) return prisma[model].deleteMany(rest);
          // @ts-ignore
          return prisma[model].updateMany({ where: rest.where, data: { [field]: now() } });
        },
      },
    },

    // convenience helpers
    model: {
      $allModels: {
        async restore(this: any, where: any) {
          return this.update({ where, data: { [field]: null } });
        },
        async forceDelete(this: any, where: any) {
          return this.delete({ where, force: true } as any);
        },
      },
    },
  });
};
