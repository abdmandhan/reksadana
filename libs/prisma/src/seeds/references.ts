import prisma from '../index.js';

export default async () => {
  const investorTypes = ['Individual', 'Corporate', 'Selling Agent'];
  const authContacts = ['Komisaris', 'Direksi'];
  const paymentMethods = ['Transfer', 'Virtual Account'];
  const fundAssetTypes = [
    {
      name: 'Corporate Bonds',
      code: 'CB',
    },
    {
      name: 'Equity',
      code: 'EQ',
    },
    {
      name: 'Government Bonds',
      code: 'GB',
    },
    {
      name: 'Time Deposit',
      code: 'TD',
    },
    {
      name: 'Money Market',
      code: 'MM',
    },
    {
      name: 'CASH',
      code: 'CASH',
    },
  ];
  // const investorStatuses = ['Entried', 'Approved', 'Rejected'];
  const genders = ['Male', 'Female'];
  const relationships = [
    'Child',
    'Husband',
    'Wife',
    'Cousin',
    'Brother',
    'Sister',
    'Parent',
  ];
  const riskLevels = ['Low', 'Medium', 'High'];
  const addressTypes = ['Home', 'Office', 'Other'];
  const religions = [
    'Islam',
    'Catholic',
    'Protestant',
    'Hindu',
    'Buddhist',
    'Confucian',
    'Other',
  ];
  const transactionTypes = [
    'Subscription',
    'Redemption',
    'Switching In',
    'Switching Out',
  ];
  const transactionStatuses = ['Entried', 'Approved', 'Rejected'];
  const educations = [
    'Sekolah Dasar (SD)',
    'Sekolah Menengah Pertama (SMP)',
    'Sekolah Menengah Atas (SMA)',
    'Diploma III',
    'Diploma IV atau Sarjana (S1)',
    ' S2 Magister',
    'S3 Doktor',
    'Other',
  ];
  const cardTypes = ['KTP', 'Passport'];
  const incomes = [
    '<10 Juta/Tahun',
    '>10-50 Juta',
    '> 50 – 100 Juta/ tahun',
    '> 100 – 500 Juta/ tahun',
    '> 500 Juta – 1 Milyar/ tahun',
    '> 1 Milyar/ tahunkj',
  ];
  const incomeSources = [
    'Gaji',
    'Keuntungan Bisnis',
    'Bunga Tabungan',
    'Warisan',
    'Dana dari Orang Tua/Anak',
    'Hibah',
    'Dana dari suami/istri',
    'Undian',
    'Keuntungan Investasi',
    'Other',
  ];
  const maritals = ['Married', 'Single', 'Divorced', 'Widowed'];
  const nationalities = ['Indonesia', 'Malaysia', 'Singapore', 'Other'];
  const jobs = [
    'Pelajar/Mahasiswa',
    'Ibu Rumah Tangga',
    'Wiraswasta/Pengusaha',
    'PNS/BUMN',
    'TNI/POLRI',
    'Pensiun',
    'Dosen/Pengajar/Guru',
    'Pegawai Swasta',
    'Other',
  ];
  const jobCategories = [
    'IT,Fintech,E-Commerce',
    'Bank dan Institusi Keuangan',
    'Pendidikan',
    'Konsultan dan Jasa',
    'Perdagangan',
    'Media,Entertainment',
    'Other',
  ];
  const jobRoles = [
    'Komisaris,Direksi,C Level',
    'Kepala Divisi,VP,AVP',
    'Manajer,Kabag',
    'Leader,Kepala Unit',
    'Officer,Staff',
    'Other',
  ];
  const agentTypes = ['Retail', 'Corporate', 'Selling Agent', 'Online'];
  // const agentLevels = ['Head', 'Sales', 'Sub Sales']
  const agentLevels = [
    { name: 'Head', fee: 0.4 },
    { name: 'Sales', fee: 0.6 },
    { name: 'Sub Sales', fee: 1 },
  ];
  const corporateLegals = [
    'Koperasi',
    'Perseroan Terbatas (PT)',
    'Persekutuan Komanditer (CV)',
    'Persekutuan Firma (Firma)',
    'Perusahaan Perorangan',
    'Yayasan',
  ];

  const banks = [
    {
      name: 'Bank Central Asia',
      code: 'BCA',
      branchs: [
        { name: 'BCA Jakarta Pusat' },
        { name: 'BCA Jakarta Selatan' },
        { name: 'BCA Jakarta Timur' },
        { name: 'BCA Jakarta Barat' },
      ],
    },
  ];

  const holidays = [
    { name: 'Libur Lebaran Idul Fitri', date: new Date('2025-04-22') },
  ];

  const fundTypes = [
    { name: 'Money Market', riskPoint: 1 },
    { name: 'Fixed Income', riskPoint: 2 },
    { name: 'Combine', riskPoint: 3 },
    { name: 'Saham', riskPoint: 4 },
    { name: 'Index', riskPoint: 5 },
    { name: 'KPD/Discrenary Fund', riskPoint: 6 },
    { name: 'RDPT', riskPoint: 7 },
    { name: 'Other', riskPoint: 8 },
  ];

  const menus: { [key: string]: { actions: string[] } } = {
    // operator menu
    'dashboard.operator': { actions: ['view'] },

    // admin menu
    'dashboard.admin': { actions: ['view'] },

    // agent menu
    'dashboard.agent': { actions: ['view'] },

    // investor menu
    'dashboard.investor': { actions: ['view'] },

    // global menu
    'manage.investors': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'manage.funds': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'manage.fund_types': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'manage.nav': { actions: ['view', 'edit', 'delete', 'create', 'approval'] },
    'manage.transactions': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'manage.agents': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'manage.agents.levels': {
      actions: ['view', 'edit', 'delete', 'create', 'approval'],
    },
    'reports.dashboard': { actions: ['view'] },
    'reports.investors': { actions: ['view'] },
    'reports.transactions': { actions: ['view'] },
    'reports.agents': { actions: ['view'] },
    'reports.funds': { actions: ['view'] },
    'manage.settings': { actions: ['view', 'edit', 'delete', 'create'] },
    'manage.users': { actions: ['view', 'edit', 'delete', 'create'] },
    'manage.roles': { actions: ['view', 'edit', 'delete', 'create'] },
  };

  // const permissions = Object.values(menus).flatMap(menu => menu.actions.map(action => `${menu}.${action}`))
  const permissions = Object.keys(menus).flatMap((menu) =>
    menus[menu].actions.map((action) => `${menu}.${action}`)
  );

  let roles: { name: string; permissions: string[] }[] = [
    {
      name: 'Maker',
      permissions: [
        ...permissions.filter((permission) =>
          permission.includes('dashboard.operator')
        ),
        // exlude approval permission
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.investors') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.funds') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.fund_types') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.nav') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.transactions') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.agents') &&
            !permission.includes('approval')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.agents.levels') &&
            !permission.includes('approval')
        ),
      ],
    },
    {
      name: 'Approver',
      permissions: [
        // only view and approval
        ...permissions.filter(
          (permission) =>
            permission.includes('dashboard.operator') &&
            permission.includes('view')
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.investors') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.funds') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.fund_types') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.nav') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.transactions') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.agents') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
        ...permissions.filter(
          (permission) =>
            permission.includes('manage.agents.levels') &&
            (permission.includes('approval') || permission.includes('view'))
        ),
      ],
    },
    {
      name: 'Admin',
      permissions: [
        ...permissions.filter((permission) =>
          permission.includes('dashboard.admin')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.investors')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.funds')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.fund_types')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.nav')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.transactions')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.agents')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.agents.levels')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.settings')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.users')
        ),
        ...permissions.filter((permission) =>
          permission.includes('manage.roles')
        ),
      ],
    },
  ];

  // console.log('roles', roles, permissions)

  return Promise.all([
    investorTypes.map(async (investorType) => {
      await prisma.investor_types.upsert({
        where: { name: investorType },
        create: { name: investorType },
        update: { name: investorType },
      });
    }),
    fundAssetTypes.map(async (fundAssetType) => {
      await prisma.fund_asset_types.upsert({
        where: { code: fundAssetType.code },
        create: { name: fundAssetType.name, code: fundAssetType.code },
        update: { name: fundAssetType.name, code: fundAssetType.code },
      });
    }),
    paymentMethods.map(async (paymentMethod) => {
      await prisma.payment_methods.upsert({
        where: { name: paymentMethod },
        create: { name: paymentMethod },
        update: { name: paymentMethod },
      });
    }),
    authContacts.map(async (authContact) => {
      await prisma.auth_contacts.upsert({
        where: { name: authContact },
        create: { name: authContact },
        update: { name: authContact },
      });
    }),
    // investorStatuses.map(async (investorStatus) => {
    //   await prisma.investor_statuses.upsert({
    //     where: { name: investorStatus },
    //     create: { name: investorStatus },
    //     update: { name: investorStatus },
    //   });
    // }),
    genders.map(async (gender) => {
      await prisma.genders.upsert({
        where: { name: gender },
        create: { name: gender },
        update: { name: gender },
      });
    }),
    relationships.map(async (relationship) => {
      await prisma.relationships.upsert({
        where: { name: relationship },
        create: { name: relationship },
        update: { name: relationship },
      });
    }),
    riskLevels.map(async (riskLevel) => {
      await prisma.risk_levels.upsert({
        where: { name: riskLevel },
        create: { name: riskLevel },
        update: { name: riskLevel },
      });
    }),
    addressTypes.map(async (addressType) => {
      await prisma.address_types.upsert({
        where: { name: addressType },
        create: { name: addressType },
        update: { name: addressType },
      });
    }),
    religions.map(async (religion) => {
      await prisma.religions.upsert({
        where: { name: religion },
        create: { name: religion },
        update: { name: religion },
      });
    }),
    transactionTypes.map(async (transactionType) => {
      await prisma.transaction_types.upsert({
        where: { name: transactionType },
        create: { name: transactionType },
        update: { name: transactionType },
      });
    }),
    transactionStatuses.map(async (transactionStatus) => {
      await prisma.transaction_statuses.upsert({
        where: { name: transactionStatus },
        create: { name: transactionStatus },
        update: { name: transactionStatus },
      });
    }),
    educations.map(async (education) => {
      await prisma.educations.upsert({
        where: { name: education },
        create: { name: education },
        update: { name: education },
      });
    }),
    cardTypes.map(async (cardType) => {
      await prisma.card_types.upsert({
        where: { name: cardType },
        create: { name: cardType },
        update: { name: cardType },
      });
    }),
    incomes.map(async (income) => {
      await prisma.incomes.upsert({
        where: { name: income },
        create: { name: income },
        update: { name: income },
      });
    }),
    incomeSources.map(async (incomeSource) => {
      await prisma.income_sources.upsert({
        where: { name: incomeSource },
        create: { name: incomeSource },
        update: { name: incomeSource },
      });
    }),
    maritals.map(async (marital) => {
      await prisma.maritals.upsert({
        where: { name: marital },
        create: { name: marital },
        update: { name: marital },
      });
    }),
    nationalities.map(async (nationality) => {
      await prisma.nationalities.upsert({
        where: { name: nationality },
        create: { name: nationality },
        update: { name: nationality },
      });
    }),
    jobs.map(async (job) => {
      await prisma.jobs.upsert({
        where: { name: job },
        create: { name: job },
        update: { name: job },
      });
    }),
    jobCategories.map(async (jobCategory) => {
      await prisma.job_categories.upsert({
        where: { name: jobCategory },
        create: { name: jobCategory },
        update: { name: jobCategory },
      });
    }),
    jobRoles.map(async (jobRole) => {
      await prisma.job_roles.upsert({
        where: { name: jobRole },
        create: { name: jobRole },
        update: { name: jobRole },
      });
    }),
    agentTypes.map(async (agentType) => {
      await prisma.agent_types.upsert({
        where: { name: agentType },
        create: { name: agentType },
        update: { name: agentType },
      });
    }),
    agentLevels.map(async (agentLevel) => {
      await prisma.agent_levels.upsert({
        where: { name: agentLevel.name },
        create: { name: agentLevel.name, fee: agentLevel.fee },
        update: { name: agentLevel.name, fee: agentLevel.fee },
      });
    }),
    banks.map(async (bank) => {
      const _bank = await prisma.banks.upsert({
        where: { name: bank.name },
        create: {
          code: bank.code,
          name: bank.name,
          is_active: true,
        },
        update: {
          code: bank.code,
          name: bank.name,
          is_active: true,
        },
      });

      bank.branchs.map(async (branch) => {
        await prisma.bank_branchs.upsert({
          where: { name: branch.name },
          create: {
            name: branch.name,
            bank_id: _bank.id,
          },
          update: branch,
        });
      });
    }),
    holidays.map(async (holiday) => {
      await prisma.holidays.upsert({
        where: { date: holiday.date },
        create: holiday,
        update: holiday,
      });
    }),
    fundTypes.map(async (fundType) => {
      await prisma.fund_types.upsert({
        where: { name: fundType.name },
        create: { name: fundType.name, risk_point: fundType.riskPoint },
        update: { name: fundType.name, risk_point: fundType.riskPoint },
      });
    }),
    corporateLegals.map(async (corporateLegal) => {
      await prisma.corporate_legals.upsert({
        where: { name: corporateLegal },
        create: { name: corporateLegal },
        update: { name: corporateLegal },
      });
    }),
    (async () => {
      await Promise.all(
        permissions.map(async (permission) => {
          await prisma.permissions.upsert({
            where: { name: permission },
            create: { name: permission },
            update: { name: permission },
          });
        })
      );

      await Promise.all(
        roles.map(async (role) => {
          const _role = await prisma.roles.upsert({
            where: { name: role.name },
            create: { name: role.name },
            update: { name: role.name },
          });

          const uniquePermissions = Array.from(new Set(role.permissions));
          for (const p of uniquePermissions) {
            const _permission = await prisma.permissions.findFirst({
              where: { name: p },
            });
            if (_permission) {
              await prisma.role_permissions.upsert({
                where: {
                  permission_id_role_id: {
                    permission_id: _permission.id,
                    role_id: _role.id,
                  },
                },
                create: { permission_id: _permission.id, role_id: _role.id },
                update: { permission_id: _permission.id, role_id: _role.id },
              });
            } else {
              console.warn('permission not found', p);
            }
          }
        })
      );
    })(),
  ]);
};
