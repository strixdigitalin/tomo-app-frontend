import React from 'react';
import FollowList from './FollowList';

// Pass { tab: 'requests' } to open directly on pending follow requests.
const Followers = props => <FollowList {...props} mode="followers" />;

export default Followers;
