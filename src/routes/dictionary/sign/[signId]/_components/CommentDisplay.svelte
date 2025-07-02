<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '@/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import { Reply } from 'lucide-svelte';
	import CommentForm from './comment-form.svelte';
	import type { CSComment } from '@/types/types';

	export let comment: CSComment & { user?: any; replies?: CSComment[] };
	export let signId: string;
	export let formatCommentDate: (date: string) => string;
	export let level: number = 0; // Track nesting level
	export let maxLevel: number = 3; // Maximum nesting level

	let showReplyForm = false;

	function toggleReplyForm() {
		showReplyForm = !showReplyForm;
	}

	function hideReplyForm() {
		showReplyForm = false;
	}
</script>

<div class="w-full" style="margin-left: {level * 2}rem;">
	<Card.Root class="w-full">
		<Card.Content class="p-4">
			<div class="flex items-start space-x-4">
				<!-- User Avatar -->
				<Avatar.Root class="w-10 h-10 flex-shrink-0">
					<Avatar.Image
						src={comment.user?.avatar}
						alt={comment.user?.display_name || 'User'}
					/>
					<Avatar.Fallback>
						{comment.user?.display_name?.[0] || 'U'}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex-1 min-w-0">
					<!-- User Info -->
					<div class="flex items-center space-x-2 mb-2">
						<span class="font-medium text-sm">
							{comment.user?.display_name || 'Utilizador Anónimo'}
						</span>
						<span class="text-xs text-gray-500">
							{formatCommentDate(comment.created_at)}
						</span>
						{#if comment.last_edited_at !== comment.created_at}
							<span class="text-xs text-gray-400">(editado)</span>
						{/if}
					</div>
					<!-- Comment Content -->
					<div class="space-y-2 mb-3">
						{#if comment.content_text}
							<p class="text-sm leading-relaxed whitespace-pre-wrap">
								{comment.content_text}
							</p>
						{/if}
						{#if comment.content_video}
							<!-- svelte-ignore a11y-media-has-caption -->
							<video
								class="w-full max-w-md rounded-lg"
								controls
								preload="metadata"
							>
								<source src={comment.content_video} type="video/mp4" />
								<source src={comment.content_video} type="video/webm" />
								O seu navegador não suporta vídeos.
							</video>
						{/if}
					</div>
					<!-- Reply Button (only show if we haven't reached max nesting level) -->
					{#if level < maxLevel}
						<div class="flex items-center space-x-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								on:click={toggleReplyForm}
								class="text-xs px-2 py-1 h-auto"
							>
								<Reply class="w-3 h-3 mr-1" />
								{showReplyForm ? 'Cancelar' : 'Responder'}
							</Button>
							{#if comment.replies && comment.replies.length > 0}
								<span class="text-xs text-gray-500">
									{comment.replies.length} resposta{comment.replies.length !== 1 ? 's' : ''}
								</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Reply Form -->
	{#if showReplyForm}
		<div class="mt-4 ml-4">
			<CommentForm 
				{signId} 
				parentCommentId={comment.id?.toString()} 
				onCancel={hideReplyForm}
			/>
		</div>
	{/if}

	<!-- Nested Replies -->
	{#if comment.replies && comment.replies.length > 0}
		<div class="mt-4 space-y-4">
			{#each comment.replies as reply}
				<svelte:self
					comment={reply}
					{signId}
					{formatCommentDate}
					level={level + 1}
					{maxLevel}
				/>
			{/each}
		</div>
	{/if}
</div>