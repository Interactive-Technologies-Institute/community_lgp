<script lang="ts">
	import CommentForm from './_components/comment-form.svelte';


    export let data;
    </script>

<div class="container mx-auto mb-20">
	<CommentForm data={data.createForm} />
</div>