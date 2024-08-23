import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BlogPost {
  'id' : PostId,
  'title' : string,
  'content' : string,
  'authorId' : UserId,
  'createdAt' : bigint,
  'updatedAt' : [] | [bigint],
}
export type PostId = bigint;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : UserProfile } |
  { 'err' : string };
export type Result_2 = { 'ok' : BlogPost } |
  { 'err' : string };
export type Result_3 = { 'ok' : PostId } |
  { 'err' : string };
export type UserId = Principal;
export interface UserProfile {
  'bio' : [] | [string],
  'username' : string,
  'profilePicture' : [] | [string],
}
export interface _SERVICE {
  'createBlogPost' : ActorMethod<
    [{ 'title' : string, 'content' : string }],
    Result_3
  >,
  'createUser' : ActorMethod<[UserProfile], Result>,
  'getAllBlogPosts' : ActorMethod<[], Array<BlogPost>>,
  'getAllUserProfiles' : ActorMethod<[], Array<UserProfile>>,
  'getBlogPost' : ActorMethod<[PostId], Result_2>,
  'getUserProfile' : ActorMethod<[UserId], Result_1>,
  'updateBlogPost' : ActorMethod<[PostId, BlogPost], Result>,
  'updateUserProfile' : ActorMethod<[UserProfile], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
