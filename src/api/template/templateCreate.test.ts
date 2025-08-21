import templateCreate from './templateCreate';
import TemplateService from '../../services/templateService';
import ApiResponseHandler from '../apiResponseHandler';
import TemplateSchema from '../../shared/schema/template/TemplateSchema';
import { PlatformRequest } from '../common';
import { Response } from 'express';

jest.mock('../../services/templateService');
jest.mock('../apiResponseHandler');
jest.mock('../../shared/schema/template/TemplateSchema', () => ({
    __esModule: true,
    default: { parse: jest.fn() }
}));
jest.mock('../utilities', () => ({
    getServiceOptions: jest.fn(() => ({}))
}));

describe('templateCreate', () => {
    let req: Partial<PlatformRequest>;
    let res: Partial<Response>;
    let mockCreate: jest.Mock;
    let mockSuccess: jest.Mock;
    let mockError: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                data: { name: 'Test Template', content: 'Hello' }
            }
        };
        res = {};
        mockCreate = jest.fn().mockResolvedValue({ id: 1, name: 'Test Template' });
        (TemplateService as any).mockImplementation(() => ({
            create: mockCreate
        }));
        mockSuccess = ApiResponseHandler.success as jest.Mock;
        mockSuccess.mockResolvedValue(undefined);
        mockError = ApiResponseHandler.error as jest.Mock;
        mockError.mockResolvedValue(undefined);
        (TemplateSchema.parse as jest.Mock).mockClear();
        mockSuccess.mockClear();
        mockError.mockClear();
    });

    it('should validate input, create template, and return success', async () => {
        await templateCreate(req as PlatformRequest, res as Response);

        expect(TemplateSchema.parse).toHaveBeenCalledWith(req.body.data);
        expect(mockCreate).toHaveBeenCalledWith(req.body.data);
        expect(ApiResponseHandler.success).toHaveBeenCalledWith(
            req,
            res,
            { id: 1, name: 'Test Template' }
        );
        expect(ApiResponseHandler.error).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
        const error = new Error('Validation failed');
        (TemplateSchema.parse as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        await templateCreate(req as PlatformRequest, res as Response);

        expect(ApiResponseHandler.success).not.toHaveBeenCalled();
        expect(ApiResponseHandler.error).toHaveBeenCalledWith(req, res, error);
    });

    it('should handle service errors', async () => {
        (TemplateSchema.parse as jest.Mock).mockImplementationOnce(() => {});
        const error = new Error('Service failed');
        mockCreate.mockRejectedValueOnce(error);

        await templateCreate(req as PlatformRequest, res as Response);

        expect(ApiResponseHandler.success).not.toHaveBeenCalled();
        expect(ApiResponseHandler.error).toHaveBeenCalledWith(req, res, error);
    });
});