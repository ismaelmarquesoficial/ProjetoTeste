import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar tenant (clínica) de exemplo
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Clínica Veterinária Exemplo',
        domain: 'clinica-exemplo',
        plan: 'professional',
        status: 'active',
        settings: {
          theme: 'light',
          allowVideoCall: true,
          allowChat: true
        }
      }
    });

    console.log('Tenant criado:', tenant);

    // Criar usuário admin da clínica
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@clinica-exemplo.com',
        password: adminPassword,
        name: 'Administrador',
        role: Role.ADMIN,
        tenantId: tenant.id
      }
    });

    console.log('Admin criado:', admin);

    // Criar veterinário de exemplo
    const vetPassword = await bcrypt.hash('vet123', 10);
    const vetUser = await prisma.user.create({
      data: {
        email: 'vet@clinica-exemplo.com',
        password: vetPassword,
        name: 'Dr. João Silva',
        role: Role.PROFESSIONAL,
        tenantId: tenant.id
      }
    });

    const professional = await prisma.professional.create({
      data: {
        specialty: 'Clínica Geral',
        bio: 'Especialista em pequenos animais com 10 anos de experiência',
        tenantId: tenant.id,
        availability: {
          monday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' }
        },
        userId: vetUser.id
      }
    });

    console.log('Veterinário criado:', professional);

    // Criar cliente de exemplo
    const clientPassword = await bcrypt.hash('client123', 10);
    const client = await prisma.user.create({
      data: {
        email: 'cliente@email.com',
        password: clientPassword,
        name: 'Maria Santos',
        role: Role.CLIENT,
        tenantId: tenant.id
      }
    });

    console.log('Cliente criado:', client);

    // Criar uma consulta de exemplo
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date('2024-01-10T10:00:00Z'),
        type: 'video',
        status: 'SCHEDULED',
        tenantId: tenant.id,
        clientId: client.id,
        professionalId: professional.id,
        payment: {
          create: {
            amount: 150.00,
            status: 'PENDING',
            paymentMethod: 'CREDIT_CARD',
            commission: 105.00 // 70% do valor
          }
        }
      }
    });

    console.log('Consulta criada:', appointment);

  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
