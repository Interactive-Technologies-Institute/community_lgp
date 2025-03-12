<script>
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import Badge from '@/components/ui/badge/badge.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';

	//Icons
	import { ThumbsUp } from 'lucide-svelte';
	import { ThumbsDown } from 'lucide-svelte';
	import { MessageSquareText } from 'lucide-svelte';
	import { Award } from 'lucide-svelte';
	import { Check } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
</script>

<div class="pt-3"></div>
<Avatar.Root class="mx-auto h-20 w-20">
	<Avatar.Image src="/avatars/user.png" alt="image description" />
</Avatar.Root>
<div class="mx-auto flex items-center justify-center pb-5 pt-3 font-bold">Linguista</div>

<div class="mx-auto flex items-center justify-center">
	<p class="font-bold">Idade:&nbsp;</p>
	<p>32</p>
</div>

<div class="mx-auto flex items-center justify-center">
	<p class="font-bold">Género:&nbsp;</p>
	<p>Feminino</p>
</div>

<div class="mx-auto flex items-center justify-center">
	<p class="font-bold">Grau de perda auditiva:&nbsp;</p>
	<p>21-40 dB</p>
</div>

<div class="mx-auto flex items-center justify-center">
	<p class="font-bold">Idioma de Linguagem Gestual:&nbsp;</p>
	<p>Linguagem Gestual Portuguesa (LGP)</p>
</div>

<div class="mx-auto flex items-center justify-center">
	<p class="font-bold">Nível QECRL:&nbsp;</p>
	<p>C2</p>
</div>

<Separator class=" mb-5 mt-5 " />

<div class="mx-auto flex items-center justify-center pb-3 font-bold">
	Sinais e variantes submetidos:
</div>
<Carousel.Root
	opts={{
		align: 'start',
	}}
	class="mx-auto w-full max-w-md"
>
	<Carousel.Content>
		{#each Array(5) as _, i (i)}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-0">
							<Dialog.Root>
								<Dialog.Trigger>Porco</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title class="mb-2 flex items-center justify-center">Porco</Dialog.Title>
										<Separator />
										<Dialog.Description class="flex items-center justify-center py-3">
											<div class="font-bold">Temas do gesto: &nbsp;</div>
											<Badge class="mr-1">animais</Badge>
											<Badge class="mr-1">agricultura</Badge>
											<Badge class="mr-1">transporte</Badge>
											<Badge>carne</Badge>
										</Dialog.Description>
										<Separator />
										<Dialog.Description>
											<div class="flex items-center justify-center py-3 font-bold">
												Como o fazer:
											</div>
											<div class="mx-auto flex max-w-xs space-x-4 pb-3">
												<div>
													<img
														class="rounded-md"
														src="https://exvhkaqgrwffbtpuoyaf.supabase.co/storage/v1/object/public/Parameters/Configuration/1OF-c.svg?t=2024-08-06T14%3A15%3A39.854Z"
														alt="image description"
													/>
												</div>
												<div>
													<img
														class="rounded-md"
														src="https://exvhkaqgrwffbtpuoyaf.supabase.co/storage/v1/object/public/Parameters/Configuration/1OF-c.svg?t=2024-08-06T14%3A15%3A39.854Z"
														alt="image description"
													/>
												</div>
												<div>
													<img
														class="rounded-md"
														src="https://exvhkaqgrwffbtpuoyaf.supabase.co/storage/v1/object/public/Parameters/Configuration/1OF-c.svg?t=2024-08-06T14%3A15%3A39.854Z"
														alt="image description"
													/>
												</div>
											</div>
											<div></div></Dialog.Description
										>
										<Separator />
										<Dialog.Description>
											<div class="flex items-center justify-center py-3 font-bold">Vídeo:</div>
											<video class="mx-auto aspect-video rounded-lg" controls>
												<track kind="captions" />
												<source
													src="https://gncgottiijvjagbqpuph.supabase.co/storage/v1/object/public/Signs/Porco.mp4?t=2024-05-31T12%3A18%3A06.046Z"
													type="video/mp4"
												/>
												Your browser does not support the video tag.
											</video>
										</Dialog.Description>
										<Dialog.Description class="flex items-center justify-center py-5">
											<ThumbsUp class="pb-1" /> 3523 &nbsp;
											<ThumbsDown class="pt-1" /> 231
										</Dialog.Description>
										<Dialog.Description class="flex items-center justify-center">
											<Button href="http://localhost:5173/dictionary/sign/10/"
												>Ir para a página do gesto</Button
											>
										</Dialog.Description>
									</Dialog.Header>
								</Dialog.Content>
							</Dialog.Root>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>

<div class="mx-auto flex items-center justify-center pb-3 pt-3 font-bold">Videos submetidos:</div>
<Carousel.Root
	opts={{
		align: 'start',
	}}
	class="mx-auto w-full max-w-md"
>
	<Carousel.Content>
		{#each Array(5) as _}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-0">
							<span class="flex h-full w-full">
								<video class="h-full w-full object-cover" controls>
									<track kind="captions" />
									<source
										src="https://gncgottiijvjagbqpuph.supabase.co/storage/v1/object/public/Signs/Porco.mp4?t=2024-05-31T12%3A18%3A06.046Z"
										type="video/mp4"
									/>
									Your browser does not support the video tag.
								</video>
							</span>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>

<div class="mx-auto mb-1 mt-4 flex items-center justify-center">
	<p class="font-bold">Número de gestos aprovados: &nbsp;</p>
	<p>432</p>
	<Check class="ml-1" />
</div>

<div class="mx-auto mb-1 flex items-center justify-center">
	<p class="font-bold">Número de gestos reprovados: &nbsp;</p>
	<p>9</p>
	<X class="" />
</div>

<div class="mx-auto mb-1 flex items-center justify-center">
	<p class="font-bold">Número de gostos acumulados: &nbsp;</p>
	<p>54</p>
	<ThumbsUp class="mb-2 ml-1" />
</div>

<div class="mx-auto mb-1 flex items-center justify-center">
	<p class="font-bold">Número de vídeos avaliados: &nbsp;</p>
	<p>54</p>
	<Award class="mb-2 ml-0.5" />
</div>

<div class="mx-auto flex items-center justify-center pb-2">
	<p class="font-bold">Número de comentários submetidos: &nbsp;</p>
	<p>12</p>
	<MessageSquareText class="mb-2 ml-1" />
</div>
