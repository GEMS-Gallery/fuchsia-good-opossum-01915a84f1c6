export const idlFactory = ({ IDL }) => {
  const PostId = IDL.Nat;
  const Result_3 = IDL.Variant({ 'ok' : PostId, 'err' : IDL.Text });
  const UserProfile = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'profilePicture' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const UserId = IDL.Principal;
  const BlogPost = IDL.Record({
    'id' : PostId,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'authorId' : UserId,
    'createdAt' : IDL.Int,
    'updatedAt' : IDL.Opt(IDL.Int),
  });
  const Result_2 = IDL.Variant({ 'ok' : BlogPost, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : UserProfile, 'err' : IDL.Text });
  return IDL.Service({
    'createBlogPost' : IDL.Func(
        [IDL.Record({ 'title' : IDL.Text, 'content' : IDL.Text })],
        [Result_3],
        [],
      ),
    'createUser' : IDL.Func([UserProfile], [Result], []),
    'getAllBlogPosts' : IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
    'getAllUserProfiles' : IDL.Func([], [IDL.Vec(UserProfile)], ['query']),
    'getBlogPost' : IDL.Func([PostId], [Result_2], ['query']),
    'getUserProfile' : IDL.Func([UserId], [Result_1], []),
    'updateBlogPost' : IDL.Func([PostId, BlogPost], [Result], []),
    'updateUserProfile' : IDL.Func([UserProfile], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
