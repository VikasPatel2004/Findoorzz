import React from 'react';

const ProfileAvatar = ({ user, size = 'md', className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'md':
        return 'w-12 h-12 text-lg';
      case 'lg':
        return 'w-16 h-16 text-xl';
      case 'xl':
        return 'w-24 h-24 text-2xl';
      case '2xl':
        return 'w-32 h-32 text-3xl';
      default:
        return 'w-12 h-12 text-lg';
    }
  };

  const sizeClasses = getSizeClasses(size);

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={`${user.name || 'User'}'s profile`}
        className={`${sizeClasses} rounded-full object-cover ${className}`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${className}`}>
      {getInitials(user?.name)}
    </div>
  );
};

export default ProfileAvatar; 