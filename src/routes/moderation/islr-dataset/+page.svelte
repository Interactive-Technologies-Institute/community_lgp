<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import IslrDatasetContributorCounts from './_components/islr-dataset-contributor-counts.svelte';
	import InviteContributorDialog from './_components/invite-contributor-dialog.svelte';
	import IslrDatasetInvitesTable from './_components/islr-dataset-invites-table.svelte';
	import IslrDatasetProgress from './_components/islr-dataset-progress.svelte';
	import RemindConsentDialog from './_components/remind-consent-dialog.svelte';
	import ResendPendingInvitesDialog from './_components/resend-pending-invites-dialog.svelte';

	export let data;

	$: pendingCount = data.invites.filter((invite) => !invite.used_at).length;
</script>

<Tabs.Content value="islr-dataset" class="mt-8 flex flex-col gap-y-4">
	<IslrDatasetProgress progress={data.datasetProgress} />
	<div class="mt-4 flex flex-wrap items-center justify-between gap-2">
		<IslrDatasetContributorCounts stageByEmail={data.contributorStageByEmail} />
		<div class="flex flex-wrap justify-end gap-2">
			<ResendPendingInvitesDialog
				data={data.resendPendingInvitesForm}
				{pendingCount}
				batchLimit={data.bulkResendLimit}
			/>
			<RemindConsentDialog
				data={data.remindConsentForm}
				dueCount={data.consentReminderDueCount}
				recentCount={data.consentReminderRecentCount}
				cooldownDays={data.consentReminderCooldownDays}
				batchLimit={data.bulkResendLimit}
			/>
			<InviteContributorDialog data={data.inviteContributorForm} />
		</div>
	</div>
	<IslrDatasetInvitesTable
		invites={data.invites}
		videoCountByEmail={data.videoCountByEmail}
		stageByEmail={data.contributorStageByEmail}
	/>
</Tabs.Content>
