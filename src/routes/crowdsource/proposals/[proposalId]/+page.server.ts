import type { CSComment, CSProposal, UserProfile } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
    async function getProposalById(id: string): Promise<CSProposal> {
        const { data: proposal, error: proposalError } = await event.locals.supabase
            .from('crowdsource_proposals')
            .select('*')
            .eq('id', id)
            .single();

        if (proposalError) {
            const errorMessage = `Error fetching proposal with ID ${id}, please try again later.`;
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            throw error(500, errorMessage);
        }

        return proposal as CSProposal;
    }

    async function getCommentsByProposalId(id:string) : Promise<CSComment[]> {
        const { data: comments, error: commentsError} = await event.locals.supabase
            .from('crowdsource_comments')
            .select('*')
            .eq('proposal_id', id)

            if (commentsError){
                const errorMessage = `Error fetching comments for the proposal with ID ${id}, please try again later.`
                setFlash({ type: 'error', message: errorMessage }, event.cookies);
                throw error(500, errorMessage);
            }
        
        return comments as CSComment[];
    }

    async function getUserById(id:string): Promise<UserProfile> {
        const { data: user, error: userError } = await event.locals.supabase
            .from('profiles')
            .select(`id, display_name, avatar`)
            .eq('id', id)
            .single()

        if(userError){
            const errorMessage = `Error fetching user with ID ${id}, please try again later.`;
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            throw error(500, errorMessage);
        }

        return user as UserProfile;
    }

   

    const proposalId = event.params.proposalId;
    let specificProposal = null;
    let specificUser = null;
    let comments = null;

    if (proposalId) {
        specificProposal = await getProposalById(proposalId);
        comments = await getCommentsByProposalId(proposalId);
        specificUser = await getUserById(specificProposal.user_id);
    }

    return {
        proposal: specificProposal,
        user: specificUser,
        comments: comments,
    };
};
