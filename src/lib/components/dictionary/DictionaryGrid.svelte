<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import type { AnnotationArray, Parameter, Sign } from "@/types/types";
    import Badge from '@/components/ui/badge/badge.svelte';
    import AnnotationGrid from "./AnnotationGrid.svelte";
    export let signs: Sign[];
    export let theme;
    export let parameter : Parameter[];


    function getParameters(annotation : AnnotationArray) {
		const parameterFilter : Parameter[] = [];
		let flatAnnotation = Object.values(annotation || {}).flat();
		parameter.filter((param : Parameter) => {
			if (flatAnnotation.includes(param.id)) {
				parameterFilter.push(param);
			}
		});
		return parameterFilter;
	}

</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {#each signs.filter(sign => sign.theme.includes(theme)) as sign (sign.id)}
    <Card.Root class="rounded-2xl">
      <!-- svelte-ignore a11y-media-has-caption -->
      <Card.Content class="flex items-center justify-center p-3">
        <div class="flex flex-col w-full">
          <video class="w-full aspect-video rounded-xl" controls muted>
            <source src={sign.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href="/dictionary/sign/{sign.id}" class="text-lg pt-4">{sign.name}</a>
          <div class="flex flex-wrap gap-2 mt-2">
            {#each sign.theme as t}
              {#if t}
                <Badge class="w-fit" variant="outline">{t}</Badge>
              {/if}
            {/each}
            <AnnotationGrid data={getParameters(sign.annotation)} />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
