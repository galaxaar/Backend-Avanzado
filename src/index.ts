import { api } from './api';
import { environmentService } from './infrastructure/EnvironmentService';
import Sentry from '@sentry/node';

environmentService.load();

const { PORT, SENTRY_DSN, NODE_ENV } = environmentService.get();

if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: NODE_ENV,
    });
}

api.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});