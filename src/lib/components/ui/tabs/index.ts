import { Tabs as TabsPrimitive } from 'bits-ui';
import Content from './tabs-content.svelte';
import List from './tabs-list.svelte';
import TriggerLink from './tabs-trigger-link.svelte';
import Trigger from './tabs-trigger.svelte';

const Root = TabsPrimitive.Root;

export {
	Content,
	List,
	Root,
	//
	Root as Tabs,
	Content as TabsContent,
	List as TabsList,
	Trigger as TabsTrigger,
	TriggerLink as TabsTriggerLink,
	Trigger,
	TriggerLink,
};
