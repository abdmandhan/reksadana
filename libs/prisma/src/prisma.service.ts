import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from './soft-delete.extension.js';

export const prisma = new PrismaClient()

// Typing: PrismaService acts like the extended client
type ExtendedClient = PrismaClient & ReturnType<PrismaClient['$extends']>;
export interface PrismaService extends ExtendedClient { } // declaration merging

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly _extended: ExtendedClient;

  constructor() {
    super();
    // Build the extended client once
    this._extended = this.$extends(
      createSoftDeleteExtension({
        field: 'deleted_at',
        excludedModels: [],
      })
    ) as unknown as ExtendedClient;

    // Copy extended delegates/methods onto `this`
    Object.assign(this, this._extended);
  }

  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
