import { DBService } from './db.service';

describe('prisma service', () => {
  describe('connection', () => {
    it('should connect to db', async () => {
      const onConnectionError = await new DBService()
        .onModuleInit()
        .catch((error) => error);

      expect(onConnectionError).toBeUndefined();
    });
  });
});
