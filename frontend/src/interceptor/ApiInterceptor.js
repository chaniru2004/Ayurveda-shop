export class ApiInterceptor {
    static async request(url, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application.json',
            'Accept': 'application/json'
        };
        options.headers = { ...defaultHeaders, ...options.headers };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Backend API offline, using local data fallback.', error);
            return null;
        }
    }
}
