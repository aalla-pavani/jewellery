import React from 'react';

const Profile = ({ userData, onLogout }) => {
  return (
    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
      <p className='cursor-pointer hover:text-black'>
        {userData ? userData.username : 'My Profile'}
      </p>
      <p className='cursor-pointer hover:text-black' onClick={onLogout}>Log out</p>
    </div>
  );
};

export default Profile;