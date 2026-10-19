<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import InviteContributorDialog from './_components/invite-contributor-dialog.svelte';
	import IslrDatasetInvitesTable from './_components/islr-dataset-invites-table.svelte';
	import IslrDatasetSummary from './_components/islr-dataset-summary.svelte';
	import ResendPendingInvitesDialog from './_components/resend-pending-invites-dialog.svelte';

	export let data;

	$: pendingCount = data.invites.filter((invite) => !invite.used_at).length;
</script>

<Tabs.Content value="islr-dataset" class="mt-8 flex flex-col gap-y-4">
	<IslrDatasetSummary summary={data.datasetSummary} />
	<div class="flex justify-end gap-x-2">
		<ResendPendingInvitesDialog
			data={data.resendPendingInvitesForm}
			{pendingCount}
			batchLimit={data.bulkResendLimit}
		/>
		<InviteContributorDialog data={data.inviteContributorForm} />
	</div>
	<IslrDatasetInvitesTable invites={data.invites} videoCountByEmail={data.videoCountByEmail} />
</Tabs.Content>
