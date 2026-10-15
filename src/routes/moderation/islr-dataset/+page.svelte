<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import InviteContributorDialog from './_components/invite-contributor-dialog.svelte';
	import IslrDatasetInvitesTable from './_components/islr-dataset-invites-table.svelte';
	import IslrDatasetSummary from './_components/islr-dataset-summary.svelte';

	export let data;
</script>

<Tabs.Content value="islr-dataset" class="mt-8 flex flex-col gap-y-4">
	<IslrDatasetSummary summary={data.datasetSummary} />
	<div class="flex justify-end">
		<InviteContributorDialog data={data.inviteContributorForm} />
	</div>
	<IslrDatasetInvitesTable invites={data.invites} videoCountByEmail={data.videoCountByEmail} />
</Tabs.Content>
