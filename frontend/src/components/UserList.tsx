import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { backend } from 'declarations/backend';
import { Principal } from '@dfinity/principal';

interface UserProfile {
  username: string;
  bio: string | null;
  profilePicture: string | null;
}

function UserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await backend.getAllUserProfiles();
        setUsers(result);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        User List
      </Typography>
      <List>
        {users.map((user, index) => (
          <ListItem key={index} component={Link} to={`/profile/${Principal.fromText(user.username).toText()}`}>
            <ListItemAvatar>
              <Avatar src={user.profilePicture || undefined} alt={user.username} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={user.bio || 'No bio available'}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;
