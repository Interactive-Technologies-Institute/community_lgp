<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import PasswordForm from './_components/password-form.svelte';
	import ProfileForm from './_components/profile-form.svelte';

	export let data;
</script>

<PageHeader
	title="Edit User Profile"
	subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
/>
<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<ProfileForm data={data.updateProfile} />
	<PasswordForm data={data.updatePassword} />
</div>
