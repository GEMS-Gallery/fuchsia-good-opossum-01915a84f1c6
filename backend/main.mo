import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Time "mo:base/Time";

actor {
  // Types
  type UserId = Principal;
  type PostId = Nat;

  type UserProfile = {
    username: Text;
    bio: ?Text;
    profilePicture: ?Text;
  };

  type BlogPost = {
    id: PostId;
    authorId: UserId;
    title: Text;
    content: Text;
    createdAt: Int;
    updatedAt: ?Int;
  };

  // Stable storage
  stable var userEntries : [(UserId, UserProfile)] = [];
  stable var postEntries : [(PostId, BlogPost)] = [];

  var users = HashMap.fromIter<UserId, UserProfile>(userEntries.vals(), 10, Principal.equal, Principal.hash);
  var blogPosts = HashMap.fromIter<PostId, BlogPost>(postEntries.vals(), 10, Nat.equal, Hash.hash);

  stable var nextPostId : Nat = 0;

  // User management
  public shared(msg) func createUser(profile: UserProfile) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case (?_) { #err("User already exists") };
      case null {
        users.put(userId, profile);
        #ok(())
      };
    }
  };

  public shared(msg) func updateUserProfile(profile: UserProfile) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case (?_) {
        users.put(userId, profile);
        #ok(())
      };
      case null { #err("User not found") };
    }
  };

  public func getUserProfile(userId: UserId) : async Result.Result<UserProfile, Text> {
    switch (users.get(userId)) {
      case (?profile) { #ok(profile) };
      case null {
        // Create a default profile if it doesn't exist
        let defaultProfile : UserProfile = {
          username = Principal.toText(userId);
          bio = null;
          profilePicture = null;
        };
        users.put(userId, defaultProfile);
        #ok(defaultProfile)
      };
    }
  };

  public query func getAllUserProfiles() : async [UserProfile] {
    Iter.toArray(users.vals())
  };

  // Blog post management
  public shared(msg) func createBlogPost(post: { title: Text; content: Text }) : async Result.Result<PostId, Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case (?_) {
        // User exists, proceed with post creation
        let postId = nextPostId;
        nextPostId += 1;
        let newPost = {
          id = postId;
          authorId = userId;
          title = post.title;
          content = post.content;
          createdAt = Time.now();
          updatedAt = null;
        };
        blogPosts.put(postId, newPost);
        #ok(postId)
      };
      case null {
        // User doesn't exist, create a default profile first
        let defaultProfile : UserProfile = {
          username = Principal.toText(userId);
          bio = null;
          profilePicture = null;
        };
        users.put(userId, defaultProfile);
        
        // Now proceed with post creation
        let postId = nextPostId;
        nextPostId += 1;
        let newPost = {
          id = postId;
          authorId = userId;
          title = post.title;
          content = post.content;
          createdAt = Time.now();
          updatedAt = null;
        };
        blogPosts.put(postId, newPost);
        #ok(postId)
      };
    }
  };

  public shared(msg) func updateBlogPost(postId: PostId, post: BlogPost) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (blogPosts.get(postId)) {
      case (?existingPost) {
        if (existingPost.authorId == userId) {
          let updatedPost = {
            id = postId;
            authorId = userId;
            title = post.title;
            content = post.content;
            createdAt = existingPost.createdAt;
            updatedAt = ?Time.now();
          };
          blogPosts.put(postId, updatedPost);
          #ok(())
        } else {
          #err("Not authorized to update this post")
        }
      };
      case null { #err("Post not found") };
    }
  };

  public query func getBlogPost(postId: PostId) : async Result.Result<BlogPost, Text> {
    switch (blogPosts.get(postId)) {
      case (?post) { #ok(post) };
      case null { #err("Post not found") };
    }
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    Iter.toArray(blogPosts.vals())
  };

  // Upgrade hooks
  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
    postEntries := Iter.toArray(blogPosts.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<UserId, UserProfile>(userEntries.vals(), 10, Principal.equal, Principal.hash);
    blogPosts := HashMap.fromIter<PostId, BlogPost>(postEntries.vals(), 10, Nat.equal, Hash.hash);
  };
}
