import TemplateService from './templateService';
import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import TemplateRepository from '../database/repositories/templateRepository';
import { IServiceOptions } from './IServiceOptions';

jest.mock('../database/repositories/mongooseRepository');
jest.mock('../database/repositories/templateRepository');

const mockOptions: IServiceOptions = {
  database: {},
  language: 'en',
};

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TemplateService(mockOptions);
  });

  describe('create', () => {
    it('should create a template and commit transaction', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.create as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.create({ name: 'Test' } as any);

      expect(MongooseRepository.createSession).toHaveBeenCalled();
      expect(TemplateRepository.create).toHaveBeenCalledWith({ name: 'Test' }, expect.objectContaining({ session }));
      expect(MongooseRepository.commitTransaction).toHaveBeenCalledWith(session);
      expect(result).toEqual({ id: '1' });
    });

    it('should abort transaction and handle unique field error on error', async () => {
      const session = {};
      const error = new Error('fail');
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create({ name: 'Test' } as any)).rejects.toThrow('fail');
      expect(MongooseRepository.abortTransaction).toHaveBeenCalledWith(session);
      expect(MongooseRepository.handleUniqueFieldError).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a template and commit transaction', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.update as jest.Mock).mockResolvedValue({ id: '1', name: 'Updated' });

      const result = await service.update('1', { name: 'Updated' } as any);

      expect(TemplateRepository.update).toHaveBeenCalledWith('1', { name: 'Updated' }, expect.objectContaining({ session }));
      expect(MongooseRepository.commitTransaction).toHaveBeenCalledWith(session);
      expect(result).toEqual({ id: '1', name: 'Updated' });
    });

    it('should abort transaction and handle unique field error on error', async () => {
      const session = {};
      const error = new Error('fail');
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.update as jest.Mock).mockRejectedValue(error);

      await expect(service.update('1', { name: 'fail' } as any)).rejects.toThrow('fail');
      expect(MongooseRepository.abortTransaction).toHaveBeenCalledWith(session);
      expect(MongooseRepository.handleUniqueFieldError).toHaveBeenCalled();
    });
  });

  describe('accessAll', () => {
    it('should call access for all ids and commit transaction', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.access as jest.Mock).mockResolvedValue(undefined);

      await service.accessAll(['1', '2']);

      expect(TemplateRepository.access).toHaveBeenCalledTimes(2);
      expect(MongooseRepository.commitTransaction).toHaveBeenCalledWith(session);
    });

    it('should abort transaction on error', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.access as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.accessAll(['1'])).rejects.toThrow('fail');
      expect(MongooseRepository.abortTransaction).toHaveBeenCalledWith(session);
    });
  });

  describe('destroyAll', () => {
    it('should destroy all templates and commit transaction', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.destroy as jest.Mock).mockResolvedValue(undefined);

      await service.destroyAll(['1', '2']);

      expect(TemplateRepository.destroy).toHaveBeenCalledTimes(2);
      expect(MongooseRepository.commitTransaction).toHaveBeenCalledWith(session);
    });

    it('should abort transaction on error', async () => {
      const session = {};
      (MongooseRepository.createSession as jest.Mock).mockResolvedValue(session);
      (TemplateRepository.destroy as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.destroyAll(['1'])).rejects.toThrow('fail');
      expect(MongooseRepository.abortTransaction).toHaveBeenCalledWith(session);
    });
  });

  describe('findById', () => {
    it('should call TemplateRepository.findById', async () => {
      (TemplateRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await service.findById('1');
      expect(TemplateRepository.findById).toHaveBeenCalledWith('1', mockOptions);
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('findAllAutocomplete', () => {
    it('should call TemplateRepository.findAllAutocomplete', async () => {
      (TemplateRepository.findAllAutocomplete as jest.Mock).mockResolvedValue([{ id: '1' }]);
      const result = await service.findAllAutocomplete('test', 5);
      expect(TemplateRepository.findAllAutocomplete).toHaveBeenCalledWith('test', 5, mockOptions);
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('findAndCountAll', () => {
    it('should call TemplateRepository.findAndCountAll', async () => {
      (TemplateRepository.findAndCountAll as jest.Mock).mockResolvedValue({ rows: [], count: 0 });
      const result = await service.findAndCountAll({ filter: 'test' });
      expect(TemplateRepository.findAndCountAll).toHaveBeenCalledWith({ filter: 'test' }, mockOptions);
      expect(result).toEqual({ rows: [], count: 0 });
    });
  });

  describe('import', () => {
    it('should throw if importHash is missing', async () => {
      await expect(service.import({ name: 'test' }, '')).rejects.toThrow(Error400);
    });

    it('should throw if importHash already exists', async () => {
      jest.spyOn(service as any, '_isImportHashExistent').mockResolvedValue(true);
      await expect(service.import({ name: 'test' }, 'hash')).rejects.toThrow(Error400);
    });

    it('should call create with importHash if not existent', async () => {
      jest.spyOn(service as any, '_isImportHashExistent').mockResolvedValue(false);
      jest.spyOn(service, 'create').mockResolvedValue({ id: '1', importHash: 'hash' });
      const result = await service.import({ name: 'test' }, 'hash');
      expect(service.create).toHaveBeenCalledWith({ name: 'test', importHash: 'hash' });
      expect(result).toEqual({ id: '1', importHash: 'hash' });
    });
  });

  describe('_isImportHashExistent', () => {
    it('should return true if count > 0', async () => {
      (TemplateRepository.count as jest.Mock).mockResolvedValue(2);
      const result = await (service as any)._isImportHashExistent('hash');
      expect(result).toBe(true);
    });

    it('should return false if count == 0', async () => {
      (TemplateRepository.count as jest.Mock).mockResolvedValue(0);
      const result = await (service as any)._isImportHashExistent('hash');
      expect(result).toBe(false);
    });
  });
});