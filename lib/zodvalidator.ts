import {z} from 'zod';

export const streamSchema = z.object({
    creatorId : z.string(),
    url : z.string()
})

export const voteSchema = z.object({
    streamId : z.string()
})
export const deleteSchema = z.object({
    creatorId : z.string()
})

export const uniqueDelSchema = z.object({
    userId : z.string(),
    id : z.string() 
})

