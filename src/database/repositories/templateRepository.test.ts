import TemplateRepository from './templateRepository';
import MongooseRepository from './mongooseRepository';
import Template from '../models/template';
import Error404 from '../../errors/Error404';

jest.mock('./mongooseRepository');
jest.mock('../models/template');
jest.mock('../../errors/Error404', () => jest.fn(function () {}));

const mockOptions = { database: 'mockDb', currentUser: { id: 'user1' } };

describe('TemplateRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a template and return it', async () => {
      const data = { name: 'Test Template' };
      const createdDoc = { id: '1', toObject: () => ({ id: '1', name: 'Test Template' }) };
      (MongooseRepository.getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1' });
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock)
        .mockResolvedValueOnce(createdDoc)
        .mockResolvedValueOnce(createdDoc);
      (Template as any).mockReturnValue({ create: jest.fn().mockResolvedValue(createdDoc) });

      const result = await TemplateRepository.create(data as any, mockOptions as any);

      expect(result).toEqual({ id: '1', name: 'Test Template' });
    });
  });

  describe('update', () => {
    it('should update a template and return it', async () => {
      const id = '1';
      const data = { name: 'Updated' };
      const foundDoc = { id, toObject: () => ({ id, name: 'Updated' }) };
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock)
        .mockResolvedValueOnce(foundDoc) // findOne
        .mockResolvedValueOnce({}) // updateOne
        .mockResolvedValueOnce(foundDoc); // findById
      (MongooseRepository.getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1' });
      (Template as any).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(foundDoc),
        updateOne: jest.fn().mockResolvedValue({}),
      });

      const result = await TemplateRepository.update(id, data as any, mockOptions as any);

      expect(result).toEqual({ id, name: 'Updated' });
    });

    it('should throw Error404 if template not found', async () => {
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        TemplateRepository.update('notfound', {} as any, mockOptions as any)
      ).rejects.toBeInstanceOf(Error404);
    });
  });

  describe('access', () => {
    it('should update hasAccess for current user', async () => {
      (MongooseRepository.getCurrentUser as jest.Mock).mockResolvedValue({ id: 'user1' });
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValue({});
      (Template as any).mockReturnValue({
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
      });

      await expect(
        TemplateRepository.access('templateId', mockOptions as any)
      ).resolves.toBeUndefined();
    });
  });

  describe('destroy', () => {
    it('should delete a template and return true', async () => {
      const foundDoc = { id: '1' };
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock)
        .mockResolvedValueOnce(foundDoc) // findOne
        .mockResolvedValueOnce({}); // deleteOne
      (Template as any).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(foundDoc),
        deleteOne: jest.fn().mockResolvedValue({}),
      });

      const result = await TemplateRepository.destroy('1', mockOptions as any);
      expect(result).toBe(true);
    });

    it('should throw Error404 if template not found', async () => {
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        TemplateRepository.destroy('notfound', mockOptions as any)
      ).rejects.toBeInstanceOf(Error404);
    });
  });

  describe('filterId', () => {
    it('should return the first filtered id', async () => {
      jest.spyOn(TemplateRepository, 'filterIds').mockResolvedValue(['id1']);
      const result = await TemplateRepository.filterId('id1', mockOptions as any);
      expect(result).toBe('id1');
    });

    it('should return null if no ids found', async () => {
      jest.spyOn(TemplateRepository, 'filterIds').mockResolvedValue([]);
      const result = await TemplateRepository.filterId('id1', mockOptions as any);
      expect(result).toBeNull();
    });
  });

  describe('filterIds', () => {
    it('should return empty array if no ids provided', async () => {
      const result = await TemplateRepository.filterIds([], mockOptions as any);
      expect(result).toEqual([]);
    });

    it('should return array of ids', async () => {
      (Template as any).mockReturnValue({
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue([{ _id: 'id1' }, { _id: 'id2' }]),
        }),
      });
      const result = await TemplateRepository.filterIds(['id1', 'id2'], mockOptions as any);
      expect(result).toEqual(['id1', 'id2']);
    });
  });

  describe('count', () => {
    it('should return count of documents', async () => {
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValue(5);
      (Template as any).mockReturnValue({
        countDocuments: jest.fn().mockReturnValue(5),
      });
      const result = await TemplateRepository.count({}, mockOptions as any);
      expect(result).toBe(5);
    });
  });

  describe('findById', () => {
    it('should return template by id', async () => {
      const foundDoc = { id: '1', toObject: () => ({ id: '1' }) };
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValue(foundDoc);
      (TemplateRepository as any)._mapRelationshipsAndFillDownloadUrl = jest.fn().mockResolvedValue({ id: '1' });

      const result = await TemplateRepository.findById('1', mockOptions as any);
      expect(result).toEqual({ id: '1' });
    });

    it('should throw Error404 if not found', async () => {
      (MongooseRepository.wrapWithSessionIfExists as jest.Mock).mockResolvedValue(null);
      await expect(
        TemplateRepository.findById('notfound', mockOptions as any)
      ).rejects.toBeInstanceOf(Error404);
    });
  });

  describe('findAndCountAll', () => {
    it('should return rows and count', async () => {
      const rows = [{ id: '1', toObject: () => ({ id: '1' }) }];
      (Template as any).mockReturnValue({
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(rows),
        countDocuments: jest.fn().mockResolvedValue(1),
      });
      (TemplateRepository as any)._mapRelationshipsAndFillDownloadUrl = jest.fn().mockResolvedValue({ id: '1' });

      const result = await TemplateRepository.findAndCountAll(
        { filter: {}, limit: 10, offset: 0, orderBy: '', countOnly: false } as any,
        mockOptions as any
      );
      expect(result).toEqual({ rows: [{ id: '1' }], count: 1 });
    });

    it('should return only count if countOnly is true', async () => {
      (Template as any).mockReturnValue({
        countDocuments: jest.fn().mockResolvedValue(2),
      });
      const result = await TemplateRepository.findAndCountAll(
        { filter: {}, countOnly: true } as any,
        mockOptions as any
      );
      expect(result).toEqual({ count: 2 });
    });
  });

  describe('findAllAutocomplete', () => {
    it('should return autocomplete results', async () => {
      const docs = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
      (Template as any).mockReturnValue({
        find: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(docs),
      });

      const result = await TemplateRepository.findAllAutocomplete('A', 2, mockOptions as any);
      expect(result).toEqual([
        { id: '1', label: 'A' },
        { id: '2', label: 'B' },
      ]);
    });
  });

  describe('_mapRelationshipsAndFillDownloadUrl', () => {
    it('should return toObject if exists', async () => {
      const doc = { toObject: () => ({ id: '1' }) };
      const result = await (TemplateRepository as any)._mapRelationshipsAndFillDownloadUrl(doc);
      expect(result).toEqual({ id: '1' });
    });

    it('should return record if toObject does not exist', async () => {
      const doc = { id: '2' };
      const result = await (TemplateRepository as any)._mapRelationshipsAndFillDownloadUrl(doc);
      expect(result).toEqual({ id: '2' });
    });
  });
});