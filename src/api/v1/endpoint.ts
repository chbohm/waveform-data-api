export interface Endpoint {
    method: 'POST' | 'GET' | 'HEAD' | 'PATCH';
    url: string;
    callback: (request: any, response: any) => void;
}

export interface EndpointRequest {
    endpoint: Endpoint;
    headers: any;
    query: string;
    json: any;
}
