import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { AUTH_ID, AUTH_SECRET } from '$env/static/private';

export const handle = SvelteKitAuth({
	providers: [
		Credentials({
			credentials: { user: {}, password: {} },
			authorize: async (credentials) => {
				let user = null;
				if (credentials.user === AUTH_ID && credentials.password === AUTH_SECRET) {
					user = { name: 'crypt keeper' };
				}
				return user;
			}
		})
	],
	pages: { signIn: '/login' }
});
