export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/vetsaas'
  }
};
