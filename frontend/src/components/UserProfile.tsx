import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TextField, Button, Avatar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { backend } from 'declarations/backend';

interface UserProfile {
  username: string;
  bio: string | null;
  profilePicture: string | null;
}

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { control, handleSubmit, setValue } = useForm<UserProfile>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const ownPrincipal = identity.getPrincipal();
        const profilePrincipal = id ? Principal.fromText(id) : ownPrincipal;
        setIsOwnProfile(ownPrincipal.toText() === profilePrincipal.toText());

        const result = await backend.getUserProfile(profilePrincipal);
        if ('ok' in result) {
          setProfile(result.ok);
          setValue('username', result.ok.username);
          setValue('bio', result.ok.bio || '');
          setValue('profilePicture', result.ok.profilePicture || '');
        } else {
          console.error('Error fetching profile:', result.err);
          // Handle the error, perhaps by showing a message to the user
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [id, setValue]);

  const onSubmit = async (data: UserProfile) => {
    try {
      const updatedProfile = {
        username: data.username,
        bio: data.bio ? [data.bio] : [], // Convert to optional
        profilePicture: data.profilePicture ? [data.profilePicture] : [], // Convert to optional
      };
      const result = await backend.updateUserProfile(updatedProfile);
      if ('ok' in result) {
        setProfile(data);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.err);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  if (profile === null) {
    return <Typography>Profile not found or error loading profile.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Avatar
            src={profile.profilePicture || undefined}
            alt={profile.username}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Controller
            name="username"
            control={control}
            defaultValue={profile.username}
            rules={{ required: 'Username is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="bio"
            control={control}
            defaultValue={profile.bio || ''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bio"
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            )}
          />
          <Controller
            name="profilePicture"
            control={control}
            defaultValue={profile.profilePicture || ''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Profile Picture URL"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="outlined" sx={{ mt: 2 }}>
            Cancel
          </Button>
        </form>
      ) : (
        <div>
          <Avatar
            src={profile.profilePicture || undefined}
            alt={profile.username}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5">{profile.username}</Typography>
          <Typography variant="body1" paragraph>{profile.bio}</Typography>
          {isOwnProfile && (
            <Button onClick={() => setIsEditing(true)} variant="contained" color="primary">
              Edit Profile
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
