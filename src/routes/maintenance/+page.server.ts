import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	if (env.PUBLIC_MAINTENANCE_MODE !== 'true') redirect(307, '/');
};
