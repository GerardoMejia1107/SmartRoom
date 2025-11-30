export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum HTTPStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export interface AppResponse {
    httpMethod: HTTPMethod;
    statusCode: HTTPStatusCode;
    message: string;
    data?: any;
    success: boolean;
    error?: string;
}

export type ResponseHandler = Partial<AppResponse>;