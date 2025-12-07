
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiResponse<T = any> = {
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
};

export function successResponse<T>(data: T, meta?: ApiResponse['meta'], status = 200) {
    return NextResponse.json(
        { data, meta, error: null },
        { status }
    );
}

export function errorResponse(message: string, code = 'INTERNAL_ERROR', status = 500, details?: any) {
    return NextResponse.json(
        { data: null, meta: null, error: { code, message, details } },
        { status }
    );
}

export function handleApiError(error: any) {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return errorResponse('Validation Failed', 'VALIDATION_ERROR', 400, (error as ZodError));
    }

    if (error instanceof Error) {
        if (error.message.includes('NOT_FOUND')) {
            return errorResponse(error.message, 'NOT_FOUND', 404);
        }
    }

    const errorMessage = error instanceof Error ? error.message :
        (typeof error === 'object' && error?.message) ? error.message :
            'Internal Server Error';

    return errorResponse(
        errorMessage,
        (typeof error === 'object' && error?.code) ? error.code : 'INTERNAL_SERVER_ERROR',
        500,
        { raw: error }
    );
}
